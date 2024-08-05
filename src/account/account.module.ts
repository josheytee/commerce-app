// src/app.module.ts
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { SessionModule } from './session/session.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AuthModule } from './auth/auth.module';
import { VendorModule } from './vendor/vendor.module';
import { CustomerModule } from './customer/customer.module';
import { UserVendorRoleModule } from './user-vendor-role/user-vendor-role.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    VendorModule,
    PermissionModule,
    UserVendorRoleModule,
    CustomerModule,
    SessionModule,
    PasswordResetModule,
    TwoFactorAuthModule,
    AuditLogModule,
    AuthModule,
  ],
})
export class AccountModule {}
