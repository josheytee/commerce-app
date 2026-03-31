import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleService } from '../role/role.service';
import { UserVendorRoleModule } from '../user-vendor-role/user-vendor-role.module';
import { VendorModule } from 'src/modules/vendor/vendor.module';
import { VendorController } from 'src/modules/vendor/vendor.controller';
import {
  RoleModel,
  VendorModel,
  PermissionModel,
  UserVendorRoleModel,
} from 'src/infrastructure';

@Module({
  imports: [
    VendorModule,
    UserVendorRoleModule,
    SequelizeModule.forFeature([
      RoleModel,
      VendorModel,
      PermissionModel,
      UserVendorRoleModel,
    ]),
  ],
  providers: [RoleService],
  controllers: [VendorController],
})
export class PermissionModule { }
