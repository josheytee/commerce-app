// user-vendor-role-permission.model.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
  AutoIncrement,
  DataType,
  PrimaryKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Permission } from './permission.model';
import { UserVendorRole } from '../user-vendor-role/user-vendor-role.model';

@Table({ tableName: 'user_vendor_role_permissions' })
export class UserVendorRolePermission extends Model<UserVendorRolePermission> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => UserVendorRole)
  @Column
  user_vendor_role_id: number;

  @ForeignKey(() => Permission)
  @Column
  permission_id: number;

  @BelongsTo(() => UserVendorRole)
  user_vendor_role: UserVendorRole;

  @BelongsTo(() => Permission)
  permission: Permission;
}
