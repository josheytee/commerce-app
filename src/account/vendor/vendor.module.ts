import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { Vendor } from './vendor.model';
import { RoleService } from '../role/role.service';
import { Role } from '../role/models/role.model';
import { Permission } from '../permission/permission.model';
import { UserVendorRoleService } from '../user-vendor-role/user-vendor-role.service';
import { UserVendorRole } from '../user-vendor-role/user-vendor-role.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Role, Vendor, Permission, UserVendorRole]),
  ],
  providers: [VendorService, UserVendorRoleService, RoleService],
  controllers: [VendorController],
  exports: [VendorService],
})
export class VendorModule {}
