// src/models/permission.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  HasMany,
} from 'sequelize-typescript';
import { RolePermission } from './role-permission.model';

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'permissions',
})
export class Permission extends Model<Permission> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  permission_name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @HasMany(() => RolePermission)
  rolePermissions!: RolePermission[];
}
