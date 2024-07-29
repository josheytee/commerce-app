// src/models/role.model.ts
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
import { VendorRole } from './vendor-role.model';
import { RolePermission } from './role-permission.model';

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'roles',
})
export class Role extends Model<Role> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  role_name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @HasMany(() => VendorRole)
  vendorRoles!: VendorRole[];

  @HasMany(() => RolePermission)
  rolePermissions!: RolePermission[];
}
