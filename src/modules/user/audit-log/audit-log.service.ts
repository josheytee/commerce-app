// src/services/audit-log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuditLog } from './audit-log.model';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectModel(AuditLog)
    private readonly auditLogModel: typeof AuditLog,
  ) {}

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogModel.findAll();
  }

  async findOne(id: number): Promise<AuditLog> {
    return this.auditLogModel.findByPk(id);
  }

  async create(auditLog: Partial<AuditLog>): Promise<AuditLog> {
    return this.auditLogModel.create(auditLog);
  }

  async update(id: number, auditLog: Partial<AuditLog>): Promise<[number]> {
    return this.auditLogModel.update(auditLog, { where: { id } });
  }

  async remove(id: number): Promise<void> {
    const auditLog = await this.auditLogModel.findByPk(id);
    if (auditLog) {
      await auditLog.destroy();
    }
  }
}
