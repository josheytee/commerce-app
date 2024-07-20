// src/app.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { SessionModule } from './session/session.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';
import { AuditLogModule } from './audit-log/audit-log.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    RoleModule,
    SessionModule,
    PasswordResetModule,
    TwoFactorAuthModule,
    AuditLogModule,
  ],
})
export class AccountModule {}
