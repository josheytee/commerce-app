import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../account/user/models/user.model';
import { Store } from 'src/store/models/store.model';
import { Role } from 'src/account/role/models/role.model';
import { Vendor } from 'src/account/vendor/vendor.model';

@Table({
  tableName: 'user_store_roles',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export class UserStoreRole extends Model<UserStoreRole> {
  @ForeignKey(() => User)
  @Column
  user_id: number;

  @ForeignKey(() => Store)
  @Column
  store_id: number;

  @ForeignKey(() => Role)
  @Column
  role_id: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Store)
  store: Store;

  @BelongsTo(() => Role)
  role: Role;
}
