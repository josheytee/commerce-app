import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { ProductModel } from 'src/infrastructure';
import {
  ProductRepository,
  VariantRepository,
  InventoryRepository,
  AttributeRepository,
  AttributeValueRepository,
  ProductVariantAttributeValueRepository,
  OrderItemRepository,
} from 'src/infrastructure/database/repositories';

import {
  ProductNotFoundException,
  ProductTypeEnum,
  ProductStatusEnum,
  VariantStatusEnum,
  StockStatusEnum,
} from 'src/shared';
import { InventoryService } from '../../inventory/inventory.service';
import {
  CreateProductWithVariantsDto,
  CreateVariantDto,
  UpdateProductDto,
  VariantAttributeValueDto,
} from '../dto';
import { PricingService } from './pricing.service';
import { ProductListResponseDto } from 'src/modules/storefront/products/dto/product-query.dto';
import { ProductFormat } from 'src/modules/storefront/products/product-format.abstract';

interface VariantInventoryPayload {
  stock_quantity?: number;
  reserved_quantity?: number;
  track_quantity?: boolean;
  allow_backorders?: boolean;
  low_stock_threshold?: number;
}

@Injectable()
export class ProductService extends ProductFormat {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly productRepo: ProductRepository,
    private readonly _orderItemRepo: OrderItemRepository,
    private readonly variantRepo: VariantRepository,
    private readonly inventoryRepo: InventoryRepository,
    private readonly attributeRepo: AttributeRepository,
    private readonly attributeValueRepo: AttributeValueRepository,
    private readonly pvavRepo: ProductVariantAttributeValueRepository,
    private readonly inventoryService: InventoryService,
    private readonly pricingService: PricingService,
    private readonly sequelize: Sequelize,
  ) {
    super();
  }

  // ============================================================
  // READS
  // ============================================================

  async getProductDetails(productId: number) {
    const product =
      await this.productRepo.findWithVariantsAndInventory(productId);
    if (!product) throw new ProductNotFoundException(productId);

    const [stock, price] = await Promise.all([
      this.inventoryService.getStockAcrossAllStores(productId),
      this.pricingService.getPrice(productId),
    ]);

    return { ...product.toJSON(), stock, price };
  }

  async searchProductsByAttributes(
    attributes: { attributeId: number; value: string }[],
  ): Promise<ProductListResponseDto> {
    const { rows, count } = await this.productRepo.searchByAttributes(
      attributes as any,
    );

    const items = rows.map((product) => this.formatProductResponse(product));

    return {
      items,
      meta: {
        totalItems: count,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: count,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  async findOneByVendor(vendorId: number, id: number) {
    const product = await this.productRepo.findOneByVendorId(vendorId, id);
    if (!product) throw new ProductNotFoundException(id);
    return product;
  }

  async findAllByVendor(vendorId: number) {
    return this.productRepo.findByVendorId(vendorId);
  }

  async findAllByStore(storeId: number) {
    return this.productRepo.findByStoreId(storeId);
  }

  // ============================================================
  // CREATE
  // ============================================================

  async create(data: CreateProductWithVariantsDto, vendorId: number) {
    const { variants, ...productData } = data;

    return this.sequelize.transaction(async (t) => {
      const product = await this.productRepo.createWithTransaction(
        {
          ...productData,
          vendor_id: vendorId,
          product_type:
            variants?.length && variants.length > 1
              ? ProductTypeEnum.VARIABLE
              : ProductTypeEnum.SIMPLE,
          status: productData.status ?? ProductStatusEnum.DRAFT,
        },
        t,
      );

      if (variants?.length) {
        await this.createVariants(product, variants, vendorId, t);
      } else {
        await this.createDefaultVariant(product, data as any, t);
      }

      return this.productRepo.findByIdWithVariants(product.id, t);
    });
  }

  private async createVariants(
    product: ProductModel,
    variants: CreateVariantDto[],
    vendorId: number,
    t: Transaction,
  ) {
    this.assertUniqueSkus(variants);

    for (const v of variants) {
      const {
        attribute_values,
        inventory,
        initial_stock: _ignoredInitialStock,
        ...variantData
      } = v as CreateVariantDto & { initial_stock?: number };

      const created = await this.variantRepo.createWithTransaction(
        {
          ...variantData,
          product_id: product.id,
          store_id: product.store_id,
          vendor_id: product.vendor_id,
          status: VariantStatusEnum.ACTIVE,
          is_default: false,
        },
        t,
      );

      if (attribute_values?.length) {
        await this.linkAttributeValues(
          created.id,
          attribute_values,
          vendorId,
          t,
        );
      }

      await this.createInventoryForVariant(
        created.id,
        (inventory ?? {}) as VariantInventoryPayload,
        t,
      );
    }
  }

  private async createDefaultVariant(
    product: ProductModel,
    data: CreateProductWithVariantsDto & {
      initial_stock?: number;
      inventory?: VariantInventoryPayload;
    },
    t: Transaction,
  ) {
    const sku = (data as any).sku ?? `SIMPLE-${product.id}-${Date.now()}`;

    const variant = await this.variantRepo.createWithTransaction(
      {
        product_id: product.id,
        store_id: product.store_id,
        vendor_id: product.vendor_id,
        sku,
        price: data.base_price,
        compare_at_price: data.compare_at_price ?? null,
        cost_price: data.cost_price ?? null,
        variant_name: 'Default',
        is_default: true,
        status: VariantStatusEnum.ACTIVE,
      },
      t,
    );

    const inventory: VariantInventoryPayload = {
      ...(data.inventory ?? {}),
      stock_quantity:
        data.inventory?.stock_quantity ?? data.initial_stock ?? 0,
    };

    await this.createInventoryForVariant(variant.id, inventory, t);

    return variant;
  }

  private async createInventoryForVariant(
    variantId: number,
    inv: VariantInventoryPayload,
    t: Transaction,
  ) {
    const stockQuantity = inv.stock_quantity ?? 0;
    const reserved = inv.reserved_quantity ?? 0;
    const track = inv.track_quantity ?? true;
    const allowBackorders = inv.allow_backorders ?? false;
    const threshold = inv.low_stock_threshold ?? 5;

    if (reserved > stockQuantity) {
      throw new BadRequestException(
        `Variant ${variantId}: reserved_quantity (${reserved}) cannot exceed stock_quantity (${stockQuantity})`,
      );
    }

    await this.inventoryRepo.createWithTransaction(
      {
        variant_id: variantId,
        stock_quantity: stockQuantity,
        reserved_quantity: reserved,
        track_quantity: track,
        allow_backorders: allowBackorders,
        low_stock_threshold: threshold,
        stock_status: this.deriveStockStatus(
          stockQuantity,
          reserved,
          track,
          allowBackorders,
          threshold,
        ),
      } as any,
      t,
    );
  }

  // ============================================================
  // PUBLISH / UNPUBLISH
  // ============================================================

  async publishProduct(
    productId: number,
    vendorId: number,
  ): Promise<ProductModel> {
    const product = await this.productRepo.findForPublish(productId);
    if (!product) throw new ProductNotFoundException(productId);

    if (product.vendor_id !== vendorId) {
      throw new ForbiddenException('Not your product');
    }

    if (product.status === ProductStatusEnum.PUBLISHED) {
      return product;
    }

    this.validateForPublish(product);

    return this.sequelize.transaction(async (t) => {
      await this.productRepo.updateWithTransaction(
        product.id,
        {
          status: ProductStatusEnum.PUBLISHED,
          published_at: product.published_at ?? new Date(),
        },
        t,
      );

      return this.productRepo.findByIdWithVariants(product.id, t);
    });
  }

  async unpublishProduct(
    productId: number,
    vendorId: number,
  ): Promise<ProductModel> {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new ProductNotFoundException(productId);
    if (product.vendor_id !== vendorId)
      throw new ForbiddenException('Not your product');
    if (product.status !== ProductStatusEnum.PUBLISHED) {
      throw new BadRequestException('Product is not published');
    }

    return this.sequelize.transaction(async (t) => {
      await this.productRepo.updateWithTransaction(
        product.id,
        { status: ProductStatusEnum.DRAFT },
        t,
      );
      return this.productRepo.findByIdWithVariants(product.id, t);
    });
  }

  private validateForPublish(product: ProductModel): void {
    if (!product.name?.trim()) {
      throw new BadRequestException('Product name is required');
    }

    if (!product.variants?.length) {
      throw new BadRequestException('Product must have at least one variant');
    }

    const unpriced = product.variants.filter(
      (v) => v.price === null || v.price === undefined || Number(v.price) <= 0,
    );
    if (unpriced.length) {
      throw new BadRequestException(
        `${unpriced.length} variant(s) are missing a valid price`,
      );
    }

    if (!product.featured_image) {
      throw new BadRequestException('At least one image is required');
    }

    const hasStock = product.variants.some((v) => {
      const inv = v.inventory;
      if (!inv) return false;
      if (inv.track_quantity === false) return true;
      const available =
        Number(inv.stock_quantity ?? 0) - Number(inv.reserved_quantity ?? 0);
      return available > 0 || !!inv.allow_backorders;
    });

    if (!hasStock) {
      throw new BadRequestException(
        'Product must have at least one variant with stock available',
      );
    }
  }

  // ============================================================
  // UPDATE
  // ============================================================

  async update(vendorId: number, id: number, data: UpdateProductDto) {
    const { variants, ...productData } = data;
    const product = await this.findOneByVendor(vendorId, id);

    const patch = this.compact(productData);

    return this.sequelize.transaction(async (t) => {
      if (Object.keys(patch).length) {
        await this.productRepo.updateWithTransaction(product.id, patch, t);
      }
      if (variants?.length) {
        await this.syncVariants(product, variants, vendorId, t);
      }
      return this.productRepo.findByIdWithVariants(product.id, t);
    });
  }

  private async syncVariants(
    product: ProductModel,
    incoming: CreateVariantDto[],
    vendorId: number,
    t: Transaction,
  ) {
    const existing = await this.variantRepo.findByProductId(product.id);
    const existingById = new Map(existing.map((v) => [v.id, v]));

    const keptIds = new Set<number>(
      incoming
        .map((v) => v.id)
        .filter(
          (id): id is number => typeof id === 'number' && existingById.has(id),
        ),
    );
    const foreignSkus = existing
      .filter((v) => !keptIds.has(v.id))
      .map((v) => v.sku)
      .filter(Boolean);
    this.assertUniqueSkus(incoming, foreignSkus);

    const finalKeptIds = new Set<number>();

    for (const v of incoming) {
      const {
        id,
        attribute_values,
        inventory,
        initial_stock: _ignoredInitialStock,
        ...variantData
      } = v as CreateVariantDto & { initial_stock?: number };

      if (id && existingById.has(id)) {
        finalKeptIds.add(id);

        const variantPatch = this.compact(variantData);
        if (Object.keys(variantPatch).length) {
          await this.variantRepo.updateWithTransaction(id, variantPatch, t);
        }

        if (attribute_values !== undefined) {
          await this.pvavRepo.deleteByVariant(id, t);
          if (attribute_values.length) {
            await this.linkAttributeValues(id, attribute_values, vendorId, t);
          }
        }

        if (inventory !== undefined) {
          await this.updateVariantInventory(
            id,
            inventory as VariantInventoryPayload,
            t,
          );
        }
      } else {
        const created = await this.variantRepo.createWithTransaction(
          {
            ...variantData,
            product_id: product.id,
            store_id: product.store_id,
            vendor_id: product.vendor_id,
            is_default: false,
            status: VariantStatusEnum.ACTIVE,
          },
          t,
        );
        finalKeptIds.add(created.id);

        if (attribute_values?.length) {
          await this.linkAttributeValues(
            created.id,
            attribute_values,
            vendorId,
            t,
          );
        }

        await this.createInventoryForVariant(
          created.id,
          (inventory ?? {}) as VariantInventoryPayload,
          t,
        );
      }
    }

    const toDelete = existing
      .filter((v) => !finalKeptIds.has(v.id))
      .map((v) => v.id);

    if (toDelete.length) {
      const openOrderCount = await this._orderItemRepo.countOpenOrderItems(
        toDelete,
        t,
      );
      if (openOrderCount > 0) {
        throw new ConflictException(
          `Cannot remove ${toDelete.length} variant(s): ${openOrderCount} open order(s) reference them`,
        );
      }

      await this.inventoryRepo.zeroOutByVariants(toDelete, t);
      await this.variantRepo.softDeleteMany(toDelete, t);
      this.logger.log(
        `Soft-deleted ${toDelete.length} variant(s) from product ${product.id}`,
      );
    }
  }

  private async updateVariantInventory(
    variantId: number,
    inv: VariantInventoryPayload,
    t: Transaction,
  ) {
    const row = await this.inventoryRepo.findOne({
      where: { variant_id: variantId },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!row) {
      this.logger.warn(
        `Variant ${variantId} had no inventory row — creating one`,
      );
      await this.createInventoryForVariant(variantId, inv, t);
      return;
    }

    const newStock =
      inv.stock_quantity ?? Number(row.stock_quantity);
    const newReserved = Number(row.reserved_quantity);
    const newTrack = inv.track_quantity ?? row.track_quantity;
    const newBackorder = inv.allow_backorders ?? row.allow_backorders;
    const newThreshold = inv.low_stock_threshold ?? row.low_stock_threshold;

    if (newStock < newReserved) {
      throw new BadRequestException(
        `Cannot set stock to ${newStock} — ${newReserved} unit(s) currently reserved by in-flight orders`,
      );
    }

    await this.inventoryRepo.updateWithTransaction(
      row.id,
      {
        stock_quantity: newStock,
        track_quantity: newTrack,
        allow_backorders: newBackorder,
        low_stock_threshold: newThreshold,
        stock_status: this.deriveStockStatus(
          newStock,
          newReserved,
          newTrack,
          newBackorder,
          newThreshold,
        ),
      },
      t,
    );
  }

  // ============================================================
  // DELETE
  // ============================================================

  async deleteProduct(vendorId: number, id: number) {
    const product = await this.productRepo.findById(id);
    if (!product) throw new ProductNotFoundException(id);
    if (product.vendor_id !== vendorId)
      throw new ForbiddenException('Not your product');

    return this.sequelize.transaction(async (t) => {
      const variants = await this.variantRepo.findByProductId(id);
      const ids = variants.map((v) => v.id);

      if (ids.length) {
        const openOrderCount = await this._orderItemRepo.countOpenOrderItems(
          ids,
          t,
        );
        if (openOrderCount > 0) {
          throw new ConflictException(
            `Cannot delete: ${openOrderCount} order(s) still reference this product`,
          );
        }
        await this.inventoryRepo.zeroOutByVariants(ids, t);
        await this.variantRepo.softDeleteMany(ids, t);
      }
      await this.productRepo.deleteById(id);

      return { success: true, message: 'Product deleted successfully' };
    });
  }

  // ============================================================
  // ATTRIBUTE LINKING (supports multi + free-form)
  // ============================================================

  private async linkAttributeValues(
    variantId: number,
    values: VariantAttributeValueDto[],
    vendorId: number,
    t: Transaction,
  ): Promise<void> {
    if (!values.length) return;

    const attributeIds = [...new Set(values.map((v) => v.attribute_id))];
    const referencedValueIds = values
      .map((v) => v.attribute_value_id)
      .filter((id): id is number => typeof id === 'number');
    const [attributes, referencedValues] = await Promise.all([
      this.attributeRepo.findByIds(attributeIds, t),
      referencedValueIds.length
        ? this.attributeValueRepo.findByIds(referencedValueIds, t)
        : Promise.resolve([] as any[]),
    ]);

    const attrMap = new Map(attributes.map((a) => [a.id, a]));
    const valueMap = new Map(referencedValues.map((v) => [v.id, v]));

    const resolvedRows: Array<{
      variant_id: number;
      attribute_id: number;
      attribute_value_id: number;
    }> = [];

    const seen = new Set<string>();

    for (const row of values) {
      const attr = attrMap.get(row.attribute_id) as any;
      if (!attr) {
        throw new BadRequestException(
          `Attribute ${row.attribute_id} not found`,
        );
      }
      if (attr.vendor_id !== null && attr.vendor_id !== vendorId) {
        throw new ForbiddenException(
          `Attribute "${attr.name}" belongs to another vendor`,
        );
      }

      let attributeValueId: number;

      if (row.attribute_value_id != null) {
        const val = valueMap.get(row.attribute_value_id) as any;
        if (!val) {
          throw new BadRequestException(
            `Value ${row.attribute_value_id} not found`,
          );
        }
        if (val.attribute_id !== attr.id) {
          throw new BadRequestException(
            `Value ${val.id} does not belong to attribute ${attr.id}`,
          );
        }
        attributeValueId = val.id;
      } else if (row.attribute_value != null) {
        const normalized = this.normalizeRawValue(attr, row.attribute_value);
        let existing = await this.attributeValueRepo.findOneByValue(
          attr.id,
          normalized,
          t,
        );
        if (!existing) {
          existing = await this.attributeValueRepo.createWithTransaction(
            {
              attribute_id: attr.id,
              value: normalized,
              display_value: normalized,
              code: null,
              image_url: null,
              sort_order: 999,
              is_active: true,
            } as any,
            t,
          );
        }
        attributeValueId = existing.id;
      } else {
        throw new BadRequestException(
          `Attribute ${row.attribute_id}: value is required`,
        );
      }

      const dedupKey = `${row.attribute_id}:${attributeValueId}`;
      if (seen.has(dedupKey)) continue;
      seen.add(dedupKey);

      resolvedRows.push({
        variant_id: variantId,
        attribute_id: attr.id,
        attribute_value_id: attributeValueId,
      });
    }

    if (resolvedRows.length) {
      await this.pvavRepo.bulkAttach(resolvedRows, t);
    }
  }

  private normalizeRawValue(attr: any, raw: string): string {
    switch (attr.type) {
      case 'text': {
        const trimmed = raw.trim();
        if (!trimmed) {
          throw new BadRequestException(
            `Attribute "${attr.name}" requires a non-empty value`,
          );
        }
        return trimmed;
      }
      case 'number': {
        const n = Number(raw);
        if (!Number.isFinite(n)) {
          throw new BadRequestException(
            `Attribute "${attr.name}" requires a numeric value`,
          );
        }
        return String(n);
      }
      case 'boolean': {
        if (raw !== 'true' && raw !== 'false') {
          throw new BadRequestException(
            `Attribute "${attr.name}" requires "true" or "false"`,
          );
        }
        return raw;
      }
      default:
        throw new BadRequestException(
          `Attribute "${attr.name}" (type: ${attr.type}) does not accept free-form values`,
        );
    }
  }

  // ============================================================
  // HELPERS
  // ============================================================

  private deriveStockStatus(
    stockQuantity: number,
    reserved: number,
    track: boolean,
    allowBackorders: boolean,
    threshold: number,
  ): StockStatusEnum {
    if (!track) return StockStatusEnum.IN_STOCK;
    const available = stockQuantity - reserved;
    if (available <= 0) {
      return allowBackorders
        ? StockStatusEnum.BACKORDER
        : StockStatusEnum.OUT_OF_STOCK;
    }
    if (available <= threshold) return StockStatusEnum.LOW_STOCK;
    return StockStatusEnum.IN_STOCK;
  }

  private assertUniqueSkus(
    variants: { sku?: string }[],
    foreignSkus: string[] = [],
  ) {
    const incoming = variants
      .map((v) => v.sku?.trim())
      .filter((s): s is string => !!s);

    const incomingSet = new Set<string>();
    for (const sku of incoming) {
      if (incomingSet.has(sku)) {
        throw new BadRequestException(`Duplicate SKU in payload: ${sku}`);
      }
      incomingSet.add(sku);
    }

    const foreign = new Set(foreignSkus.map((s) => s.trim()).filter(Boolean));
    for (const sku of incomingSet) {
      if (foreign.has(sku)) {
        throw new BadRequestException(
          `SKU "${sku}" is already used by another variant on this product`,
        );
      }
    }
  }

  private compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
    const out: Partial<T> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) (out as any)[k] = v;
    }
    return out;
  }
}
