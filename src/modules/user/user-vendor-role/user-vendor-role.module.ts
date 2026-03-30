import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../user/models/user.model';
import { Vendor } from '../../vendor/onboarding/vendor.model';
import { UserVendorRoleController } from './user-vendor-role.controller';
import { UserVendorRole } from './user-vendor-role.model';
import { UserVendorRoleService } from './user-vendor-role.service';
import { UserVendorRoleRepository } from './user-vendor-role.repository';

@Module({
  imports: [SequelizeModule.forFeature([User, Vendor, UserVendorRole])],
  providers: [UserVendorRoleRepository, UserVendorRoleService],
  controllers: [UserVendorRoleController],
  exports: [UserVendorRoleRepository, UserVendorRoleService],
})
export class UserVendorRoleModule { }
