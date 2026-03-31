import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductAttributeService } from './product_attribute.service';
import { ProductAttributeController } from './product_attribute.controller';
import { ProductAttributeModel } from 'src/infrastructure';

@Module({
  imports: [SequelizeModule.forFeature([ProductAttributeModel])],
  providers: [ProductAttributeService],
  controllers: [ProductAttributeController],
})
export class ProductAttributeModule { }
