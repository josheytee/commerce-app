import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { JwtService } from '@nestjs/jwt';

import { StoreRepository } from './store.repository';
import { UserVendorRoleModule } from 'src/modules/user/user-vendor-role/user-vendor-role.module';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/modules/user/permission/permissions.guard';
import { RoleService } from 'src/modules/user/role/role.service';
import { VendorModule } from '../vendor.module';
import {
  RoleModel,
  StoreModel,
  VendorModel,
  CategoryModel,
  PermissionModel,
  UserVendorRoleModel,
  ProductModel,
  ProductVariantModel,
  InventoryModel,
  OrderModel,
  VariantStoreModel,
  AttributeModel,
  AttributeValueModel,
  OrderItemModel,
  DiscountModel,
  ProductVariantAttributeValueModel,
} from 'src/infrastructure';

import { ProductsModule } from 'src/modules/storefront/products/products.module';
import { PricingService, ProductService } from '../products/services';

import {
  ProductRepository,
  VariantRepository as ProductVariantRepository,
  InventoryRepository,
  OrderRepository,
  OrderItemRepository,
  VariantStoreRepository,
  AttributeRepository,
  AttributeValueRepository,
  ProductVariantAttributeValueRepository,
} from 'src/infrastructure/database/repositories';
import { InventoryService } from '../inventory/inventory.service';

//TOdO: Review these imports and remove any unused ones
@Module({
  imports: [
    forwardRef(() => VendorModule),
    ProductsModule,
    UserVendorRoleModule,
    SequelizeModule.forFeature([
      RoleModel,
      StoreModel,
      ProductModel,
      ProductVariantModel,
      VendorModel,
      CategoryModel,
      PermissionModel,
      UserVendorRoleModel,
      InventoryModel,
      OrderModel,
      OrderItemModel,
      VariantStoreModel,
      AttributeModel,
      AttributeValueModel,
      DiscountModel,
      ProductVariantAttributeValueModel,
    ]),
  ],
  providers: [
    JwtService,
    StoreService,
    JwtAuthGuard,
    PermissionsGuard,
    RoleService,
    StoreRepository,
    ProductRepository,
    ProductVariantRepository,
    InventoryRepository,
    OrderItemRepository,
    OrderRepository,
    ProductService,
    InventoryService,
    PricingService,
    VariantStoreRepository,
    AttributeRepository,
    AttributeValueRepository,
    ProductVariantAttributeValueRepository,
  ],
  controllers: [StoreController],
  exports: [StoreService, StoreRepository],
})
export class StoreModule { }
