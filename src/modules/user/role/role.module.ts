import { RoleRepository } from './role.repository';
// src/modules/role.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { PermissionsGuard } from '../permission/permissions.guard';
import { UserVendorRoleModule } from '../user-vendor-role/user-vendor-role.module';
import {
  RoleModel,
  VendorModel,
  PermissionModel,
  UserVendorRoleModel,
} from 'src/infrastructure';

@Module({
  imports: [
    UserVendorRoleModule,
    SequelizeModule.forFeature([
      RoleModel,
      VendorModel,
      PermissionModel,
      UserVendorRoleModel,
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository, PermissionsGuard],
  exports: [RoleService, RoleRepository, PermissionsGuard],
})
export class RoleModule { }
