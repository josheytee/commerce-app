// src/modules/two-factor-auth.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { TwoFactorAuthModel } from 'src/infrastructure';

@Module({
  imports: [SequelizeModule.forFeature([TwoFactorAuthModel])],
  controllers: [TwoFactorAuthController],
  providers: [TwoFactorAuthService],
})
export class TwoFactorAuthModule { }
