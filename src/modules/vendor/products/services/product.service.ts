import {
  Injectable,
  ForbiddenException,
  BadRequestException,
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
  ProductVariantAttributeValueRepository
} from 'src/infrastructure/database/repositories';

import {
  ProductNotFoundException,
  ProductTypeEnum,
  ProductStatusEnum,
  VariantStatusEnum,
} from 'src/shared';
import { InventoryService } from '../../inventory/inventory.service';
import {
  CreateProductWithVariantsDto,
  CreateVariantDto,
  UpdateProductDto,
} from '../dto';
import { PricingService } from './pricing.service';
import { ProductListResponseDto } from 'src/modules/storefront/products/dto/product-query.dto';
import { ProductFormat } from 'src/modules/storefront/products/product-format.abstract';

@Injectable()
export class ProductService extends ProductFormat {
  constructor(
    private readonly productRepo: ProductRepository,
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

  // ---- READS ----

  async getProductDetails(productId: number) {
    const product =
      await this.productRepo.findWithVariantsAndInventories(productId);
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
  // ---- CREATE ----

  async create(data: CreateProductWithVariantsDto, vendorId: number) {
    const { variants, ...productData } = data;

    return this.sequelize.transaction(async (t) => {
      const product = await this.productRepo.createWithTransaction(
        {
          ...productData,
          vendor_id: vendorId,
          product_type: variants?.length
            ? ProductTypeEnum.VARIABLE
            : ProductTypeEnum.SIMPLE,
          status: productData.status ?? ProductStatusEnum.DRAFT,
        },
        t,
      );

      if (variants?.length) {
        await this.createVariableProductVariants(
          product,
          variants,
          vendorId,
          t,
        );
      } else {
        await this.createDefaultVariant(product, data as any, t);
      }

      return this.productRepo.findByIdWithVariants(product.id, t);
    });
    // recomputePriceRange is now a model hook on ProductVariant
  }

  private async createVariableProductVariants(
    product: ProductModel,
    variants: CreateVariantDto[],
    vendorId: number,
    t: Transaction,
  ) {
    this.assertUniqueSkus(variants);

    for (const v of variants) {
      const { attribute_values, initial_stock, ...variantData } = v;

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
      console.log('Created variant:', created.id, attribute_values);

      if (attribute_values?.length) {
        await this.linkAttributeValues(
          created.id,
          attribute_values,
          vendorId,
          t,
        );
      }

      await this.inventoryRepo.createForVariant(
        created.id,
        product.store_id,
        initial_stock ?? 0,
        t,
      );
    }
  }

  private async createDefaultVariant(
    product: ProductModel,
    data: CreateProductWithVariantsDto & { initial_stock?: number },
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

    await this.inventoryRepo.createForVariant(
      variant.id,
      product.store_id,
      data.initial_stock ?? 0,
      t,
    );

    return variant;
  }

  async publishProduct(
    productId: number,
    vendorId: number,
  ): Promise<ProductModel> {
    // 1. Load with everything publish-validation needs
    const product = await this.productRepo.findForPublish(productId);
    if (!product) throw new ProductNotFoundException(productId);

    // 2. Authorization
    if (product.vendor_id !== vendorId) {
      throw new ForbiddenException('Not your product');
    }

    // 3. Idempotency — already published? No-op.
    if (product.status === ProductStatusEnum.PUBLISHED) {
      return product;
    }

    // 4. Business validation (throws on failure)
    this.validateForPublish(product);

    // 5. State transition + side effects (transactional)
    return this.sequelize.transaction(async (t) => {
      await this.productRepo.updateWithTransaction(
        product.id,
        {
          status: ProductStatusEnum.PUBLISHED,
          published_at: product.published_at ?? new Date(),
        },
        t,
      );

      // Side effect: refresh search index (async, non-blocking)
      // e.g., queue a job — NOT inline in the transaction
      //@TODO: Uncomment this when search indexing is implemented
      // await this.searchIndexQueue.enqueue({ productId: product.id });

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

    return this.sequelize
      .transaction(async (t) => {
        await this.productRepo.updateWithTransaction(
          product.id,
          { status: ProductStatusEnum.DRAFT },
          t,
        );
        return this.productRepo.findByIdWithVariants(product.id, t);
      })
      .then(async (updated) => {
        // await this.searchIndexQueue.enqueue({
        //   productId: updated.id,
        //   action: 'remove',
        // });
        return updated;
      });
  }

  // async archiveProduct(
  //   productId: number,
  //   vendorId: number,
  // ): Promise<ProductModel> {
  //   // Similar — sets status = ARCHIVED, keeps data, hides from storefront
  // }
  /**
   * Domain rule: what makes a product publishable.
   * Throws BadRequestException with a clear message on the first failure.
   */
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

    // If you require at least one stock location with quantity > 0:
    const hasStock = product.variants.some((v) =>
      (v.inventories ?? []).some((i) => Number(i.quantity) > 0),
    );
    if (!hasStock) {
      throw new BadRequestException(
        'Product must have stock at least one store',
      );
    }
  }

  // ---- UPDATE ----

  async update(vendorId: number, id: number, data: UpdateProductDto) {
    const { variants, ...productData } = data;
    const product = await this.findOneByVendor(vendorId, id);

    return this.sequelize.transaction(async (t) => {
      await this.productRepo.updateWithTransaction(product.id, productData, t);
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

    const keptIds = new Set<number>();

    for (const v of incoming) {
      const { id, attribute_values, initial_stock, ...variantData } = v;

      if (id && existingById.has(id)) {
        keptIds.add(id);
        await this.variantRepo.updateWithTransaction(id, variantData, t);

        if (attribute_values?.length) {
          await this.pvavRepo.deleteByVariant(id, t);
          await this.linkAttributeValues(id, attribute_values, vendorId, t);
        }

        if (initial_stock !== undefined) {
          await this.inventoryRepo.findOrCreateForVariant(
            id,
            product.store_id,
            initial_stock,
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
          },
          t,
        );
        keptIds.add(created.id);

        if (attribute_values?.length) {
          await this.linkAttributeValues(
            created.id,
            attribute_values,
            vendorId,
            t,
          );
        }
        await this.inventoryRepo.createForVariant(
          created.id,
          product.store_id,
          initial_stock ?? 0,
          t,
        );
      }
    }

    // Soft-delete variants no longer in the payload
    const toDelete = existing
      .filter((v) => !keptIds.has(v.id))
      .map((v) => v.id);
    if (toDelete.length) {
      await this.inventoryRepo.zeroOutByVariants(toDelete, t);
      await this.variantRepo.softDeleteMany(toDelete, t);
    }
  }

  // ---- DELETE ----

  async deleteProduct(vendorId: number, id: number) {
    const product = await this.productRepo.findById(id);
    if (!product) throw new ProductNotFoundException(id);
    if (product.vendor_id !== vendorId)
      throw new ForbiddenException('Not your product');

    return this.sequelize.transaction(async (t) => {
      const variants = await this.variantRepo.findByProductId(id);
      const ids = variants.map((v) => v.id);

      if (ids.length) {
        await this.inventoryRepo.zeroOutByVariants(ids, t);
        await this.variantRepo.softDeleteMany(ids, t);
      }
      await this.productRepo.deleteById(id);

      return { success: true, message: 'Product deleted successfully' };
    });
  }

  // ---- ATTRIBUTE LINKING ----

  private async linkAttributeValues(
    variantId: number,
    values: { attribute_id: number; attribute_value_id: number }[],
    vendorId: number,
    t: Transaction,
  ) {
    const attributeIds = [...new Set(values.map((v) => v.attribute_id))];
    const valueIds = [...new Set(values.map((v) => v.attribute_value_id))];

    const [attributes, attributeValues] = await Promise.all([
      this.attributeRepo.findByIds(attributeIds, t),
      this.attributeValueRepo.findByIds(valueIds, t),
    ]);

    const attrMap = new Map(attributes.map((a) => [a.id, a]));
    const valMap = new Map(attributeValues.map((v) => [v.id, v]));

    const rows = values.map((v) => {
      const attr = attrMap.get(v.attribute_id) as any;
      const val = valMap.get(v.attribute_value_id) as any;

      if (!attr)
        throw new BadRequestException(`Attribute ${v.attribute_id} not found`);
      if (!val)
        throw new BadRequestException(
          `Value ${v.attribute_value_id} not found`,
        );
      if (attr.vendor_id !== null && attr.vendor_id !== vendorId) {
        throw new ForbiddenException(
          `Attribute ${attr.name} belongs to another vendor`,
        );
      }
      if (val.attribute_id !== attr.id) {
        throw new BadRequestException(
          `Value ${val.id} does not belong to attribute ${attr.id}`,
        );
      }

      return {
        variant_id: variantId,
        attribute_id: attr.id,
        attribute_value_id: val.id,
      };
    });

    await this.pvavRepo.bulkAttach(rows, t);
  }

  // ---- HELPERS ----

  private assertUniqueSkus(variants: CreateVariantDto[]) {
    const skus = variants.map((v) => v.sku).filter(Boolean);
    if (new Set(skus).size !== skus.length) {
      throw new BadRequestException('Duplicate SKUs in variant payload');
    }
  }
}
