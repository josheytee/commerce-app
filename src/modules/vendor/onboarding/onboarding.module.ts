import { VendorRepository } from '../../../infrastructure/database/repositories/vendor.repository';
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
  MediaModel,
  PermissionModel,
  OrderModel,
} from 'src/infrastructure';
import { MediaRepository, OrderRepository } from 'src/infrastructure/database/repositories';

@Module({
  imports: [
    forwardRef(() => RoleModule),
    MediaModule,
    UserVendorRoleModule,
    SequelizeModule.forFeature([
      RoleModel,
      MediaModel,
      VendorModel,
      PermissionModel,
      UserVendorRoleModel,
      OrderModel,
    ]),
  ],
  providers: [VendorService, VendorRepository, MediaRepository, OrderRepository],
  controllers: [VendorOnboardingController],
  exports: [VendorService, VendorRepository],
})
export class OnboardingModule { }
