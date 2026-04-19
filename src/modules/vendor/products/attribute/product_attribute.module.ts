import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
// import { ProductAttributeService } from './product_attribute.service';
// import { ProductAttributeController } from './product_attribute.controller';
import { ProductAttributeValueModel } from 'src/infrastructure';

@Module({
  imports: [SequelizeModule.forFeature([ProductAttributeValueModel])],
  providers: [],
  controllers: [
    //ProductAttributeController
  ],
})
export class ProductAttributeModule { }
