import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleService } from '../role/role.service';
import { Role } from '../role/models/role.model';
import { Permission } from './permission.model';
import { UserVendorRoleService } from '../user-vendor-role/user-vendor-role.service';
import { UserVendorRole } from '../user-vendor-role/user-vendor-role.model';
import { VendorController } from '../vendor/vendor.controller';
import { Vendor } from '../vendor/vendor.model';
import { VendorService } from '../vendor/vendor.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Role, Vendor, Permission, UserVendorRole]),
  ],
  providers: [VendorService, UserVendorRoleService, RoleService],
  controllers: [VendorController],
})
export class PermissionModule {}
