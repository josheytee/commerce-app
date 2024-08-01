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
import { Permission } from 'src/account/role/models/permission.model';
import { RolePermission } from 'src/account/role/models/role-permission.model';
import { UserRolesGuard } from 'src/account/role/user-roles.guard';
import { VendorRolesGuard } from 'src/account/role/vendor-roles.guard';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Role,
      Vendor,
      Store,
      Category,
      Permission,
      RolePermission,
    ]),
  ],
  providers: [
    StoreService,
    UserRolesGuard,
    VendorRolesGuard,
    RoleService,
    VendorService,
  ],
  controllers: [StoreController],
})
export class StoreModule {}
