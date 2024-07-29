// src/modules/role.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from './models/role.model';
import { Vendor } from '../vendor/vendor.model';
import { VendorRole } from './models/vendor-role.model';

@Module({
  imports: [SequelizeModule.forFeature([Role, Vendor, VendorRole])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
