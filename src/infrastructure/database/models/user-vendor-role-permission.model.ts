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
import { UserVendorRoleModel } from './user-vendor-role.model';
import { PermissionModel } from './permission.model';

@Table({ tableName: 'user_vendor_role_permissions' })
export class UserVendorRolePermissionModel extends Model<UserVendorRolePermissionModel> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => UserVendorRoleModel)
  @Column
  user_vendor_role_id: number;

  @ForeignKey(() => PermissionModel)
  @Column
  permission_id: number;

  @BelongsTo(() => UserVendorRoleModel)
  user_vendor_role: UserVendorRoleModel;

  @BelongsTo(() => PermissionModel)
  permission: PermissionModel;
}
