// src/controllers/audit-log.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLog } from './audit-log.model';

@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async findAll(): Promise<AuditLog[]> {
    return this.auditLogService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AuditLog> {
    return this.auditLogService.findOne(id);
  }

  @Post()
  async create(@Body() auditLog: Partial<AuditLog>): Promise<AuditLog> {
    return this.auditLogService.create(auditLog);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() auditLog: Partial<AuditLog>,
  ): Promise<[number]> {
    return this.auditLogService.update(id, auditLog);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.auditLogService.remove(id);
  }
}
