import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductModel } from 'src/infrastructure';
import {
  ProductRepository,
  VariantRepository,
} from 'src/infrastructure/database/repositories';
import { InventoryService } from '../../inventory/inventory.service';
import { PricingService } from './pricing.service';
import {
  ProductNotFoundException,
  ProductStatusEnum,
  VariantStockStatusEnum,
} from 'src/shared';
import { CreateProductWithVariantsDto, UpdateProductDto } from '../dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ProductService implements OnModuleInit {
  private _inventoryRepo: any;
  constructor(
    @InjectModel(ProductModel)
    private productModel: typeof ProductModel,
    private readonly _productRepo: ProductRepository,
    private readonly _inventoryService: InventoryService,
    private readonly pricingService: PricingService,
    private readonly _variantRepositort: VariantRepository,
    private _sequelize: Sequelize,
  ) { }

  async onModuleInit() {
    this._inventoryRepo = await this._inventoryService.getRepo();
  }

  async getProductDetails(productId: number) {
    const product = await this._productRepo.findOne({
      where: { id: productId },
    });

    const [stock, price] = await Promise.all([
      this._inventoryService.getStock(productId),
      this.pricingService.getPrice(productId),
    ]);

    return {
      ...product.toJSON(),
      stock,
      price,
    };
  }

  async publishProduct(productId: number) {
    const product = await this._productRepo.findById(productId, {
      include: ['variants', 'gallery_images'],
    });

    if (!product.name) throw new Error('Name required');
    if (!product.base_price) throw new Error('Price required');

    if (
      product.product_type === 'variable' &&
      (!product.variants || product.variants.length === 0)
    ) {
      throw new Error('Variants required');
    }

    if (!product.gallery_images?.length) {
      throw new Error('At least one image required');
    }

    return this._productRepo.update(productId, {
      status: ProductStatusEnum.PUBLISHED,
      published_at: new Date(),
    });
  }

  async create(data: CreateProductWithVariantsDto) {
    return this._sequelize.transaction(async (t) => {
      const { variants, ...productData } = data;

      // 1️⃣ Create product
      const product = await this._productRepo.createWithTransaction(
        productData,
        t,
      );

      // 2️⃣ Handle variants
      if (variants?.length) {
        // Create all provided variants
        for (const variant of variants) {
          const { attribute_values, ...variantData } = variant;
          const createdVariant =
            await this._variantRepositort.createWithTransaction(
              {
                ...variantData,
                product_id: product.id,
              },
              t,
            );

          // Create inventory for each variant
          await (
            await this._inventoryService.getRepo()
          ).createWithTransaction(
            {
              product_variant_id: createdVariant.id,
              stock_quantity: variant.initial_stock ?? 0,
              quantity: variant.initial_stock ?? 0,
            },
            t,
          );
        }
      } else {
        // ✅ PRODUCT HAS NO VARIANTS - CREATE DEFAULT VARIANT
        await this.createDefaultVariant(product, t);
      }

      return product;
    });
  }

  /**
   * Create a default variant for simple products (no variants)
   */
  private async createDefaultVariant(product: any, transaction: any) {
    // Generate SKU if not provided
    const sku = product.sku || `SIMPLE-${product.id}-${Date.now()}`;

    // Create default variant
    const defaultVariant = await this._variantRepositort.createWithTransaction(
      {
        product_id: product.id,
        sku: sku,
        price: product.base_price,
        compare_at_price: product.compare_at_price || null,
        cost_price: product.cost_price || null,
        variant_name: 'Default',
        status: VariantStockStatusEnum.ACTIVE,
        // is_default: true,
        // stock_quantity: product.stock_quantity || 0,
        weight: product.weight || null,
        length: product.length || null,
        width: product.width || null,
        height: product.height || null,
        requires_shipping: product.requires_shipping ?? true,
      },
      transaction,
    );

    // Create inventory for default variant
    await (
      await this._inventoryService.getRepo()
    ).createWithTransaction(
      {
        product_variant_id: defaultVariant.id,
        quantity: product.stock_quantity || 0,
      },
      transaction,
    );

    // Optionally, update product to reference default variant
    await this._productRepo.updateWithTransaction(
      product.id,
      {
        // default_variant_id: defaultVariant.id,
      },
      transaction,
    );

    return defaultVariant;
  }

  async createWithAttributes(
    createProductDto: CreateProductDto,
  ): Promise<ProductModel> {
    const product = await this.productModel.create({
      name: createProductDto.name,
    });
    // for (const attr of createProductDto.attributes) {
    //   await this.productAttributeModel.create({
    //     product_id: product.id,
    //     attribute_id: attr.attributeId,
    //     value: attr.value,
    //   });
    // }
    return product;
  }

  async searchProductsByAttributes(
    attributes: { attributeId: number; value: string }[],
  ): Promise<ProductModel[]> {
    const products = await this.productModel.findAll({
      include: [
        {
          // model: ProductAttributeValue,
          where: attributes.map((attr) => ({
            attribute_id: attr.attributeId,
            value: attr.value,
          })),
        },
      ],
    });

    return products;
  }

  async findAll(vendorId: number): Promise<ProductModel[]> {
    return this.productModel.findAll();
  }

  async findOne(id: number): Promise<ProductModel> {
    const product = await this.productModel.findByPk(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findOneByVendor(vendorId: number, id: number): Promise<ProductModel> {
    const product = await this._productRepo.findOneByVendorId(vendorId, id);

    return product;
  }

  async findAllByVendor(
    vendorId: number,
  ): Promise<{ rows: ProductModel[]; count: number }> {
    const products = await this._productRepo.findByVendorId(vendorId);

    return products;
  }

  async findOneByStore(storeId: number, id: number): Promise<ProductModel> {
    const product = await this._productRepo.findOneByStoreId(storeId, id);

    return product;
  }

  async findAllByStore(
    storeId: number,
  ): Promise<{ rows: ProductModel[]; count: number }> {
    const products = await this._productRepo.findByStoreId(storeId);

    return products;
  }

  async update(
    vendorId: number,
    id: number,
    data: UpdateProductDto,
  ): Promise<ProductModel> {
    const { variants, ...productData } = data;

    const product = await this.findOneByVendor(vendorId, id);
    return product.update(productData);
  }

  /**
   * Delete product - cascade delete variants and inventory
   */
  async deleteProduct(id: number) {
    return this._sequelize.transaction(async (t) => {
      const product = await this._productRepo.findById(id);
      if (!product) {
        throw new ProductNotFoundException(id);
      }

      // Get all variants
      const variants = await this._variantRepositort.findByProductId(id);

      // Delete inventory for each variant
      for (const variant of variants) {
        await this._inventoryRepo.deleteByVariantId(variant.id, t);
      }

      // Delete all variants
      await this._variantRepositort.deleteByProductId(id);

      // Delete product
      await this._productRepo.deleteById(id);

      return { success: true, message: 'Product deleted successfully' };
    });
  }
}
