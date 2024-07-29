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
import { User } from 'src/account/user/models/user.model';
import { VendorRole } from './../../account/role/models/vendor-role.model';
import { Role } from 'src/account/role/models/role.model';
import { Store } from 'src/store/models/store.model';

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

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  // @HasMany(() => VendorRole)
  // vendorRoles!: VendorRole[];

  @BelongsToMany(() => Role, () => VendorRole)
  roles: Role[];

  @HasMany(() => Store)
  stores: Store[];
}
