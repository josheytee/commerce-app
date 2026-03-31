import { Module } from '@nestjs/common';
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
} from 'src/infrastructure';

@Module({
  imports: [
    VendorModule,
    UserVendorRoleModule,
    SequelizeModule.forFeature([
      RoleModel,
      StoreModel,
      VendorModel,
      CategoryModel,
      PermissionModel,
      UserVendorRoleModel,
    ]),
  ],
  providers: [
    JwtService,
    StoreService,
    JwtAuthGuard,
    PermissionsGuard,
    RoleService,
    StoreRepository,
  ],
  controllers: [StoreController],
  exports: [StoreService, StoreRepository],
})
export class StoreModule { }
