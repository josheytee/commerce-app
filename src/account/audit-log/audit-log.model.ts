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
import { User } from '../user/models/user.model';

@Table({
  timestamps: false,
  underscored: true,
  tableName: 'audit_logs',
})
export class AuditLog extends Model<AuditLog> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  action!: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  action_time!: Date;

  @Column(DataType.STRING)
  ip_address?: string;
}
