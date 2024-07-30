import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { VendorRoleService } from './vendor-role.service';
import { VendorRoleController } from './vendor-role.controller'; // Adjust the path as needed
import { Role } from '../role/models/role.model';
import { VendorRole } from '../role/models/vendor-role.model';
import { Vendor } from '../vendor/vendor.model';

@Module({
  imports: [SequelizeModule.forFeature([VendorRole, Vendor, Role])],
  providers: [VendorRoleService],
  controllers: [VendorRoleController],
  exports: [VendorRoleService],
})
export class VendorRoleModule {}
