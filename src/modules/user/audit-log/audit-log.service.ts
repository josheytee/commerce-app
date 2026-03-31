// src/services/audit-log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuditLogModel } from 'src/infrastructure';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectModel(AuditLogModel)
    private readonly auditLogModel: typeof AuditLogModel,
  ) { }

  async findAll(): Promise<AuditLogModel[]> {
    return this.auditLogModel.findAll();
  }

  async findOne(id: number): Promise<AuditLogModel> {
    return this.auditLogModel.findByPk(id);
  }

  async create(auditLog: Partial<AuditLogModel>): Promise<AuditLogModel> {
    return this.auditLogModel.create(auditLog);
  }

  async update(id: number, auditLog: Partial<AuditLogModel>): Promise<[number]> {
    return this.auditLogModel.update(auditLog, { where: { id } });
  }

  async remove(id: number): Promise<void> {
    const auditLog = await this.auditLogModel.findByPk(id);
    if (auditLog) {
      await auditLog.destroy();
    }
  }
}
