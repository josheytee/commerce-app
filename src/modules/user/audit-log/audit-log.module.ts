// src/modules/audit-log.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuditLogController } from './audit-log.controller';
import { AuditLogService } from './audit-log.service';
import { AuditLogModel } from 'src/infrastructure';

@Module({
  imports: [SequelizeModule.forFeature([AuditLogModel])],
  controllers: [AuditLogController],
  providers: [AuditLogService],
})
export class AuditLogModule { }
