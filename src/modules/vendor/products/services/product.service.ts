import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductModel } from 'src/infrastructure';
import {
  ProductRepository,
  VariantRepository,
} from 'src/infrastructure/database/repositories';
import { InventoryService } from '../../inventory/inventory.service';
import { PricingService } from './pricing.service';
import { ProductStatusEnum } from 'src/shared';
import { CreateProductWithVariantsDto, UpdateProductDto } from '../dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel)
    private productModel: typeof ProductModel,
    private readonly productRepo: ProductRepository,
    private readonly inventoryService: InventoryService,
    private readonly pricingService: PricingService,
    private readonly _variantRepositort: VariantRepository,
    private _sequelize: Sequelize,
  ) { }

  async getProductDetails(productId: number) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    const [stock, price] = await Promise.all([
      this.inventoryService.getStock(productId),
      this.pricingService.getPrice(productId),
    ]);

    return {
      ...product.toJSON(),
      stock,
      price,
    };
  }

  async publishProduct(productId: number) {
    const product = await this.productRepo.findById(productId, {
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

    return this.productRepo.update(productId, {
      status: ProductStatusEnum.PUBLISHED,
      published_at: new Date(),
    });
  }

  async create(data: CreateProductWithVariantsDto) {
    return this._sequelize.transaction(async (t) => {
      const { variants, ...productData } = data;

      // 1️⃣ Create product
      const product = await this.productRepo.createWithTransaction(
        productData,
        t,
      );

      if (variants?.length) {
        for (const variant of variants) {
          // 2️⃣ Create variant
          const { attribute_values, ...variantData } = variant;
          const createdVariant =
            await this._variantRepositort.createWithTransaction(
              {
                ...variantData,
                product_id: product.id,
              },
              t,
            );

          // 3️⃣ Create inventory (🔥 THIS IS THE LINK)
          await (
            await this.inventoryService.getRepo()
          ).createWithTransaction(
            {
              product_variant_id: createdVariant.id,
              quantity: variant.initial_stock ?? 0,
            },
            t,
          );
        }
      }

      return product;
    });
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
    const product = await this.productModel.findOne({
      where: {
        id,
        vendor_id: vendorId,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
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

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await product.destroy();
  }
}
