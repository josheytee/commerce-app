import { Column, Model, Table, ForeignKey } from 'sequelize-typescript';
import { User } from './user.model';
import { Store } from 'src/store/models/store.model';
import { Role } from 'src/account/role/models/role.model';

@Table({
  tableName: 'user_store_roles',
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
}
