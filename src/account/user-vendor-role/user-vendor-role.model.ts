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
import { Role } from '../role/models/role.model';
import { User } from '../user/models/user.model';
import { Vendor } from '../vendor/vendor.model';
import { Permission } from '../permission/permission.model';
import { UserVendorRolePermission } from '../permission/user-vendor-role-permission.model';

@Table({
  tableName: 'user_vendor_roles',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export class UserVendorRole extends Model<UserVendorRole> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @ForeignKey(() => Vendor)
  @Column
  vendor_id: number;

  @ForeignKey(() => Role)
  @Column
  role_id: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Vendor)
  vendor: Vendor;

  @BelongsTo(() => Role)
  role: Role;

  @BelongsToMany(() => Permission, () => UserVendorRolePermission)
  permissions: Permission[];
}
