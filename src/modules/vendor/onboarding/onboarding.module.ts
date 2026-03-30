import { VendorRepository } from './vendor.repository';
import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VendorService } from './vendor.service';
import { Vendor } from './vendor.model';
import { Role } from '../../user/role/models/role.model';
import { Permission } from '../../user/permission/permission.model';
import { UserVendorRole } from '../../user/user-vendor-role/user-vendor-role.model';
import { UserVendorRoleModule } from '../../user/user-vendor-role/user-vendor-role.module';
import { RoleModule } from '../../user/role/role.module';
import { MediaModule } from 'src/modules/vendor/media/media.module';
import { VendorOnboardingController } from './controllers';

@Module({
  imports: [
    forwardRef(() => RoleModule),
    MediaModule,
    UserVendorRoleModule,
    SequelizeModule.forFeature([Role, Vendor, Permission, UserVendorRole]),
  ],
  providers: [VendorService, VendorRepository],
  controllers: [VendorOnboardingController],
  exports: [VendorService, VendorRepository],
})
export class OnboardingModule { }
