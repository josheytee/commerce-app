// src/models/role-permission.model.ts
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
import { Role } from './role.model';
import { Permission } from './permission.model';

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'role_permissions',
})
export class RolePermission extends Model<RolePermission> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  role_id!: number;

  @AllowNull(false)
  @ForeignKey(() => Permission)
  @Column(DataType.INTEGER)
  permission_id!: number;
}
