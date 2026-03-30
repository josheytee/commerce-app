import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Store } from './models/store.model';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { JwtService } from '@nestjs/jwt';

import { StoreRepository } from './store.repository';
import { VendorModule } from '../vendor.module';
import { UserVendorRoleModule } from 'src/modules/user/user-vendor-role/user-vendor-role.module';
import { Role } from 'src/modules/user/role/models/role.model';
import { Vendor } from '../onboarding/vendor.model';
import { Category } from 'src/modules/storefront/categories/category.model';
import { Permission } from 'src/modules/user/permission/permission.model';
import { UserVendorRole } from 'src/modules/user/user-vendor-role/user-vendor-role.model';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/modules/user/permission/permissions.guard';
import { RoleService } from 'src/modules/user/role/role.service';

@Module({
  imports: [
    VendorModule,
    UserVendorRoleModule,
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
    StoreRepository,
  ],
  controllers: [StoreController],
  exports: [StoreService, StoreRepository],
})
export class StoreModule { }
