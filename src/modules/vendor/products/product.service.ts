import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductModel } from 'src/infrastructure';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel)
    private productModel: typeof ProductModel,
  ) { }

  async create(data: Partial<ProductModel>): Promise<ProductModel> {
    return this.productModel.create(data);
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

  async findAll(): Promise<ProductModel[]> {
    return this.productModel.findAll();
  }

  async findOne(id: number): Promise<ProductModel> {
    const product = await this.productModel.findByPk(id);
    if (!product) {
      throw new NotFoundException('ProductModel not found');
    }
    return product;
  }

  async update(id: number, data: Partial<ProductModel>): Promise<ProductModel> {
    const product = await this.findOne(id);
    return product.update(data);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await product.destroy();
  }
}
