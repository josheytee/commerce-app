// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/sequelize';
// import { CreateProductAttributeDto } from './dto/create_product_attribute.dto';
// import { UpdateProductAttributeDto } from './dto/update_product_attribute.dto';
// import { Op } from 'sequelize/types/operators';

// @Injectable()
// export class ProductAttributeService {
//   constructor(
//     @InjectModel(ProductAttributeModel)
//     private readonly productAttributeModel: typeof ProductAttributeModel,
//   ) { }

//   async create(
//     createProductAttributeDto: CreateProductAttributeDto,
//   ): Promise<ProductAttributeModel> {
//     return this.productAttributeModel.create(createProductAttributeDto);
//   }

//   async findAll(): Promise<ProductAttributeModel[]> {
//     return this.productAttributeModel.findAll();
//   }

//   async findOne(id: number): Promise<ProductAttributeModel> {
//     return this.productAttributeModel.findByPk(id);
//   }

//   async update(
//     id: number,
//     updateProductAttributeDto: UpdateProductAttributeDto,
//   ): Promise<[number, ProductAttributeModel[]]> {
//     return this.productAttributeModel.update(updateProductAttributeDto, {
//       where: { id },
//       returning: true,
//     });
//   }

//   async remove(id: number): Promise<void> {
//     const productAttribute = await this.findOne(id);
//     await productAttribute.destroy();
//   }
//   async search(query: string): Promise<ProductAttributeModel[]> {
//     return this.productAttributeModel.findAll({
//       where: {
//         // searchable: true,
//         value: {
//           [Op.iLike]: `%${query}%`,
//         },
//       },
//     });
//   }
// }
