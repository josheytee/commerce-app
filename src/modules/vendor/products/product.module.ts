import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  MediaModel,
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
import { ProductMediaController } from './product-media.controller';
import { MediaUploadService } from '../media/services';

@Module({
  imports: [
    InventoryModule,
    UserVendorRoleModule,
    SequelizeModule.forFeature([
      ProductModel,
      MediaModel,
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
    MediaUploadService
  ],
  controllers: [ProductController, ProductMediaController],
})
export class ProductModule { }
