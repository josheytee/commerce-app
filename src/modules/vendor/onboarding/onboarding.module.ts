import { VendorRepository } from './vendor.repository';
import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VendorService } from './vendor.service';
import { UserVendorRoleModule } from '../../user/user-vendor-role/user-vendor-role.module';
import { RoleModule } from '../../user/role/role.module';
import { MediaModule } from 'src/modules/vendor/media/media.module';
import { VendorOnboardingController } from './controllers';
import {
  VendorModel,
  UserVendorRoleModel,
  RoleModel,
  PermissionModel,
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
  controllers: [VendorOnboardingController],
  exports: [VendorService, VendorRepository],
})
export class OnboardingModule { }
