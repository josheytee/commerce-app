// src/models/audit-log.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  ForeignKey,
} from 'sequelize-typescript';
import { UserModel } from './user.model';

@Table({
  timestamps: false,
  underscored: true,
  tableName: 'audit_logs',
})
export class AuditLogModel extends Model<AuditLogModel> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column(DataType.INTEGER)
  user_id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  action!: string;

  @AllowNull(true)
  @Column(DataType.JSONB)
  old_value?: string;

  @AllowNull(true)
  @Column(DataType.JSONB)
  new_value?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  record_id?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  table_name?: string;

  @Column(DataType.STRING)
  ip_address?: string;
}
