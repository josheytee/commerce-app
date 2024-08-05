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
  BelongsToMany,
} from 'sequelize-typescript';
import { UserVendorRole } from 'src/account/user-vendor-role/user-vendor-role.model';
import { UserVendorRolePermission } from './user-vendor-role-permission.model';

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

  @BelongsToMany(() => UserVendorRole, () => UserVendorRolePermission)
  user_vendor_roles: UserVendorRole[];
}
