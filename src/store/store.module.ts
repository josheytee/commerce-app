import { JwtAuthGuard } from './../account/auth/jwt-auth.guard';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Store } from './models/store.model';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { RoleService } from 'src/account/role/role.service';
import { Role } from 'src/account/role/models/role.model';
import { Vendor } from 'src/account/vendor/vendor.model';
import { VendorService } from 'src/account/vendor/vendor.service';
import { Category } from './models/category.model';
import { JwtService } from '@nestjs/jwt';
import { PermissionsGuard } from 'src/account/permission/permissions.guard';
import { UserVendorRoleService } from 'src/account/user-vendor-role/user-vendor-role.service';
import { UserVendorRole } from 'src/account/user-vendor-role/user-vendor-role.model';
import { Permission } from 'src/account/permission/permission.model';
import { VendorModule } from 'src/account/vendor/vendor.module';

@Module({
  imports: [
    VendorModule,
    SequelizeModule.forFeature([
      Role,
      Store,
      Vendor,
      Category,
      Permission,
      UserVendorRole,
    ]),
  ],
  providers: [
    JwtService,
    StoreService,
    JwtAuthGuard,
    PermissionsGuard,
    RoleService,
  ],
  controllers: [StoreController],
})
export class StoreModule { }
