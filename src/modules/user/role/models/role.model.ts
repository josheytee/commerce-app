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
import { Vendor } from 'src/modules/vendor/onboarding/vendor.model';
import { UserStoreRole } from 'src/modules/vendor/store/models/user-store-role.model';
import { User } from '../../user/models/user.model';
import { Store } from 'src/modules/vendor/store/models/store.model';

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
