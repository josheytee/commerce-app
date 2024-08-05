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
  BelongsToMany,
  ForeignKey,
} from 'sequelize-typescript';
import { Store } from 'src/store/models/store.model';
import { UserStoreRole } from 'src/store/models/user-store-role.model';
import { Permission } from '../../permission/permission.model';
import { Vendor } from 'src/account/vendor/vendor.model';
import { User } from 'src/account/user/models/user.model';
import { UserVendorRolePermission } from '../../permission/user-vendor-role-permission.model';

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
  name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @ForeignKey(() => Vendor)
  @Column
  created_by_vendor_id: number;

  @BelongsToMany(() => User, () => UserStoreRole)
  users: User[];

  @BelongsToMany(() => Store, () => UserStoreRole)
  stores: Store[];
}
