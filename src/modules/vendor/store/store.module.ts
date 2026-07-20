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
} from 'src/infrastructure';

import { ProductRepository } from 'src/infrastructure/database/repositories/product.repository';
import { VariantRepository as ProductVariantRepository } from 'src/infrastructure/database/repositories/variant.repository';
import { ProductsModule } from 'src/modules/storefront/products/products.module';
import { PricingService, ProductService } from '../products/services';
import { InventoryService } from '../inventory/inventory.service';
import { InventoryRepository } from 'src/infrastructure/database/repositories/inventory.repository';
import { OrderRepository } from 'src/infrastructure/database/repositories/order.repository';
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
    OrderRepository,
    ProductService,
    InventoryService,
    PricingService
  ],
  controllers: [StoreController],
  exports: [StoreService, StoreRepository],
})
export class StoreModule { }
