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

import { UserModel } from './user.model';
import { VendorModel } from './vendor.model';
import { UserStoreRoleModel } from './user-store-role.model';
import { StoreModel } from './store.model';

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'roles',
})
export class RoleModel extends Model<RoleModel> {
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

  @ForeignKey(() => VendorModel)
  @Column
  created_by_vendor_id: number;

  @BelongsToMany(() => UserModel, () => UserStoreRoleModel)
  users: UserModel[];

  @BelongsToMany(() => StoreModel, () => UserStoreRoleModel)
  stores: StoreModel[];
}
