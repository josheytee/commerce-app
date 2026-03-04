import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '../user/models/user.model';
import { Store } from 'src/store/models/store.model';
import { Role } from 'src/account/role/models/role.model';
import { UserVendorRole } from '../user-vendor-role/user-vendor-role.model';

@Table({
  timestamps: true,
  underscored: true,
  // paranoid: true,
  tableName: 'vendors',
})
export class Vendor extends Model<Vendor> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  business_name: string;

  @Column
  business_phone: string;

  @ForeignKey(() => User)
  @Column
  user_id: number; // Foreign key to the User model

  @Column
  api_key: string;

  @BelongsTo(() => User)
  user: User; // Association with User model

  @BelongsToMany(() => User, () => UserVendorRole)
  users: User[];

  @BelongsToMany(() => Role, () => UserVendorRole)
  roles: Role[];

  @HasMany(() => Store)
  stores: Store[];
}
