import { forwardRef, Module } from '@nestjs/common';
import { RoleModule } from '../user/role/role.module';
import { MediaModule } from './media/media.module';
import { UserVendorRoleModule } from '../user/user-vendor-role/user-vendor-role.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { VendorService } from './onboarding/vendor.service';
import { VendorRepository } from './onboarding/vendor.repository';
import { VendorMediaController } from './vendor-media.controller';
import { VendorController } from './vendor.controller';
import {
  RoleModel,
  VendorModel,
  PermissionModel,
  UserVendorRoleModel,
} from 'src/infrastructure';

@Module({
  imports: [
    forwardRef(() => RoleModule),
    MediaModule,
    UserVendorRoleModule,
    SequelizeModule.forFeature([
      RoleModel,
      VendorModel,
      PermissionModel,
      UserVendorRoleModel,
    ]),
  ],
  providers: [VendorService, VendorRepository],
  controllers: [VendorController, VendorMediaController],
  exports: [VendorService, VendorRepository],
})
export class VendorModule { }
