import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ProductModel,
  ProductVariantModel,
  UserVendorRoleModel,
} from 'src/infrastructure';
import { ProductService } from './services/product.service';
import { ProductController } from './product.controller';
import { UserVendorRoleModule } from 'src/modules/user/user-vendor-role/user-vendor-role.module';
import {
  ProductRepository,
  VariantRepository,
} from 'src/infrastructure/database/repositories';
import { InventoryModule } from '../inventory/inventory.module';
import { PricingService } from './services/pricing.service';

@Module({
  imports: [
    InventoryModule,
    UserVendorRoleModule,
    SequelizeModule.forFeature([
      ProductModel,
      ProductVariantModel,
      UserVendorRoleModel,
    ]),
  ],
  providers: [
    ProductService,
    ProductRepository,
    VariantRepository,
    // ProductVariantModelRepository,
    PricingService,
  ],
  controllers: [ProductController],
})
export class ProductModule { }
