import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  PrimaryKey,
  BelongsToMany,
} from 'sequelize-typescript';
import { UserModel } from './user.model';
import { VendorModel } from './vendor.model';
import { RoleModel } from './role.model';
import { PermissionModel } from './permission.model';
import { UserVendorRolePermissionModel } from './user-vendor-role-permission.model';

@Table({
  tableName: 'user_vendor_roles',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export class UserVendorRoleModel extends Model<UserVendorRoleModel> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => UserModel)
  @Column
  user_id: number;

  @ForeignKey(() => VendorModel)
  @Column
  vendor_id: number;

  @ForeignKey(() => RoleModel)
  @Column
  role_id: number;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @BelongsTo(() => VendorModel)
  vendor: VendorModel;

  @BelongsTo(() => RoleModel)
  role: RoleModel;

  @BelongsToMany(() => PermissionModel, () => UserVendorRolePermissionModel)
  permissions: PermissionModel[];
}
