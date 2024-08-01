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
  BelongsToMany,
} from 'sequelize-typescript';
import { RolePermission } from './role-permission.model';
import { Role } from './role.model';

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
  name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @BelongsToMany(() => Role, () => RolePermission)
  roles: Role[];

  @HasMany(() => RolePermission)
  rolePermissions!: RolePermission[];
}
