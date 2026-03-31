// src/modules/password-reset.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PasswordResetController } from './password-reset.controller';
import { PasswordResetService } from './password-reset.service';
import { PasswordResetModel } from 'src/infrastructure';

@Module({
  imports: [SequelizeModule.forFeature([PasswordResetModel])],
  controllers: [PasswordResetController],
  providers: [PasswordResetService],
})
export class PasswordResetModule { }
