import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleService } from '../role/role.service';
import { Role } from '../role/models/role.model';
import { Permission } from './permission.model';
import { UserVendorRole } from '../user-vendor-role/user-vendor-role.model';
import { Vendor } from '../vendor/vendor.model';
import { VendorModule } from '../vendor/vendor.module';
import { UserVendorRoleModule } from '../user-vendor-role/user-vendor-role.module';
import { VendorController } from '../vendor/controllers';

@Module({
  imports: [
    VendorModule,
    UserVendorRoleModule,
    SequelizeModule.forFeature([Role, Vendor, Permission, UserVendorRole]),
  ],
  providers: [RoleService],
  controllers: [VendorController],
})
export class PermissionModule { }
