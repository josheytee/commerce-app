import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Store } from './models/store.model';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { RoleService } from 'src/account/role/role.service';
import { Role } from 'src/account/role/models/role.model';
import { Vendor } from 'src/account/vendor/vendor.model';
import { RolesGuard } from 'src/account/role/roles.guard';
import { VendorService } from 'src/account/vendor/vendor.service';
import { Category } from './models/category.model';

@Module({
  imports: [SequelizeModule.forFeature([Role, Vendor, Store, Category])],
  providers: [StoreService, RolesGuard, RoleService, VendorService],
  controllers: [StoreController],
})
export class StoreModule {}
