import { forwardRef, Module } from "@nestjs/common";
import { RoleModule } from "../user/role/role.module";
import { MediaModule } from "./media/media.module";
import { UserVendorRoleModule } from "../user/user-vendor-role/user-vendor-role.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { Role } from "../user/role/models/role.model";
import { Vendor } from "./onboarding/vendor.model";
import { Permission } from "../user/permission/permission.model";
import { UserVendorRole } from "../user/user-vendor-role/user-vendor-role.model";
import { VendorService } from "./onboarding/vendor.service";
import { VendorRepository } from "./onboarding/vendor.repository";
import { VendorMediaController } from "./vendor-media.controller";
import { VendorController } from "./vendor.controller";


@Module({
  imports: [
    forwardRef(() => RoleModule),
    MediaModule,
    UserVendorRoleModule,
    SequelizeModule.forFeature([Role, Vendor, Permission, UserVendorRole]),
  ],
  providers: [VendorService, VendorRepository],
  controllers: [VendorController, VendorMediaController],
  exports: [VendorService, VendorRepository],
})
export class VendorModule { }
