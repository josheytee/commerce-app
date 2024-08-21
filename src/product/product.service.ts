import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductAttribute } from 'src/attribute/models/product_attribute.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async create(data: Partial<Product>): Promise<Product> {
    return this.productModel.create(data);
  }

  async createWithAttributes(
    createProductDto: CreateProductDto,
  ): Promise<Product> {
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
  ): Promise<Product[]> {
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

  async findAll(): Promise<Product[]> {
    return this.productModel.findAll();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productModel.findByPk(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    const product = await this.findOne(id);
    return product.update(data);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await product.destroy();
  }
}
