import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  MediaModel,
  ProductModel,
  ProductVariantModel,
  UserVendorRoleModel,
  InventoryModel,
  AttributeModel,
  AttributeValueModel,
  DiscountModel,
  ProductVariantAttributeValueModel,
  OrderItemModel,
} from 'src/infrastructure';
import { ProductService } from './services/product.service';
import { ProductController } from './product.controller';
import { UserVendorRoleModule } from 'src/modules/user/user-vendor-role/user-vendor-role.module';
import {
  ProductRepository,
  VariantRepository,
  AttributeRepository,
  InventoryRepository,
  AttributeValueRepository,
  ProductVariantAttributeValueRepository,
  OrderItemRepository,
} from 'src/infrastructure/database/repositories';
import { InventoryModule } from '../inventory/inventory.module';
import { PricingService } from './services/pricing.service';
import { ProductMediaController } from './product-media.controller';
import { MediaUploadService } from '../media/services';
import { AttributeModule } from './attribute/attribute.module';

@Module({
  imports: [
    InventoryModule,
    UserVendorRoleModule,
    AttributeModule,
    SequelizeModule.forFeature([
      ProductModel,
      MediaModel,
      DiscountModel,
      InventoryModel,
      AttributeModel,
      OrderItemModel,
      InventoryModel,
      AttributeValueModel,
      ProductVariantModel,
      UserVendorRoleModel,
      ProductVariantAttributeValueModel,
    ]),
  ],
  providers: [
    PricingService,
    ProductService,
    PricingService,
    VariantRepository,
    ProductRepository,
    MediaUploadService,
    InventoryRepository,
    OrderItemRepository,
    AttributeRepository,
    AttributeValueRepository,
    ProductVariantAttributeValueRepository,
  ],
  controllers: [ProductController, ProductMediaController],
})
export class ProductModule { }
