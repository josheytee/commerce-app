import { RoleRepository } from './role.repository';
// src/modules/role.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from './models/role.model';
import { Vendor } from '../vendor/vendor.model';
import { Permission } from '../permission/permission.model';
import { UserVendorRole } from '../user-vendor-role/user-vendor-role.model';
import { PermissionsGuard } from '../permission/permissions.guard';
import { VendorModule } from '../vendor/vendor.module';
import { UserVendorRoleModule } from '../user-vendor-role/user-vendor-role.module';

@Module({
  imports: [
    VendorModule,
    UserVendorRoleModule,
    SequelizeModule.forFeature([Role, Vendor, Permission, UserVendorRole]),
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository, PermissionsGuard],
  exports: [RoleService, RoleRepository, PermissionsGuard],
})
export class RoleModule { }
