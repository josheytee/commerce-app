import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductAttributeService } from './product_attribute.service';
import { ProductAttributeController } from './product_attribute.controller';
import { ProductAttribute } from './models/product_attribute.model';

@Module({
  imports: [SequelizeModule.forFeature([ProductAttribute])],
  providers: [ProductAttributeService],
  controllers: [ProductAttributeController],
})
export class ProductAttributeModule {}
