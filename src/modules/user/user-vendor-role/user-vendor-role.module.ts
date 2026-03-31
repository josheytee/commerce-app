import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserVendorRoleController } from './user-vendor-role.controller';
import { UserVendorRoleService } from './user-vendor-role.service';
import { UserVendorRoleRepository } from './user-vendor-role.repository';
import {
  UserModel,
  VendorModel,
  UserVendorRoleModel,
} from 'src/infrastructure';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel, VendorModel, UserVendorRoleModel]),
  ],
  providers: [UserVendorRoleRepository, UserVendorRoleService],
  controllers: [UserVendorRoleController],
  exports: [UserVendorRoleRepository, UserVendorRoleService],
})
export class UserVendorRoleModule { }
