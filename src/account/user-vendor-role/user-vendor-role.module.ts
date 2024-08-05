import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../user/models/user.model';
import { Vendor } from '../vendor/vendor.model';
import { UserVendorRoleController } from './user-vendor-role.controller';
import { UserVendorRole } from './user-vendor-role.model';
import { UserVendorRoleService } from './user-vendor-role.service';

@Module({
  imports: [SequelizeModule.forFeature([User, Vendor, UserVendorRole])],
  providers: [UserVendorRoleService],
  controllers: [UserVendorRoleController],
})
export class UserVendorRoleModule {}
