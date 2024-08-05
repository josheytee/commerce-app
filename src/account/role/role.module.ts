// src/modules/role.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from './models/role.model';
import { Vendor } from '../vendor/vendor.model';
import { Permission } from '../permission/permission.model';
import { VendorService } from '../vendor/vendor.service';
import { UserVendorRole } from '../user-vendor-role/user-vendor-role.model';
import { PermissionsGuard } from '../permission/permissions.guard';
import { UserVendorRoleService } from '../user-vendor-role/user-vendor-role.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Role, Vendor, Permission, UserVendorRole]),
  ],
  controllers: [RoleController],
  providers: [
    RoleService,
    VendorService,
    PermissionsGuard,
    UserVendorRoleService,
  ],
})
export class RoleModule {}
