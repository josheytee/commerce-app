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
import { StoreSectionModule } from './store-section/store-section.module';
import { StoreModule } from './store/store.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { OrderModule } from './orders/order.module';
import { DeliveryModule } from './delivery/delivery.module';
import { ProductModule } from './products/product.module';

@Module({
  imports: [
    forwardRef(() => RoleModule),
    forwardRef(() => StoreSectionModule),
    forwardRef(() => StoreModule),
    OnboardingModule,
    MediaModule,
    UserVendorRoleModule,
    ProductModule,
    OrderModule,
    DeliveryModule,
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
