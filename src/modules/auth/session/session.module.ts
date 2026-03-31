// src/modules/session.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { SessionModel } from 'src/infrastructure';

@Module({
  imports: [SequelizeModule.forFeature([SessionModel])],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule { }
