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
import { UserVendorRoleModel } from './user-vendor-role.model';
import { UserVendorRolePermissionModel } from './user-vendor-role-permission.model';

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'permissions',
})
export class PermissionModel extends Model<PermissionModel> {
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

  @BelongsToMany(() => UserVendorRoleModel, () => UserVendorRolePermissionModel)
  user_vendor_roles: UserVendorRoleModel[];
}
