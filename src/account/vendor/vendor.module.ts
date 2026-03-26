import { VendorRepository } from './vendor.repository';
import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { Vendor } from './vendor.model';
import { Role } from '../role/models/role.model';
import { Permission } from '../permission/permission.model';
import { UserVendorRole } from '../user-vendor-role/user-vendor-role.model';
import { UserVendorRoleModule } from '../user-vendor-role/user-vendor-role.module';
import { RoleModule } from '../role/role.module';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [
    forwardRef(() => RoleModule),
    MediaModule,
    UserVendorRoleModule,
    SequelizeModule.forFeature([Role, Vendor, Permission, UserVendorRole]),
  ],
  providers: [VendorService, VendorRepository],
  controllers: [VendorController],
  exports: [VendorService, VendorRepository],
})
export class VendorModule { }
