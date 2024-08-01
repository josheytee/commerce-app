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
  BelongsToMany,
} from 'sequelize-typescript';
import { VendorRole } from './vendor-role.model';
import { RolePermission } from './role-permission.model';
import { User } from 'src/account/user/models/user.model';
import { Store } from 'src/store/models/store.model';
import { UserStoreRole } from 'src/account/user/models/user-store-role.model';
import { Permission } from './permission.model';

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

  @HasMany(() => VendorRole)
  vendorRoles!: VendorRole[];

  @BelongsToMany(() => User, () => UserStoreRole)
  users: User[];

  @BelongsToMany(() => Store, () => UserStoreRole)
  stores: Store[];

  @BelongsToMany(() => Permission, () => RolePermission)
  permissions: Permission[];
}
