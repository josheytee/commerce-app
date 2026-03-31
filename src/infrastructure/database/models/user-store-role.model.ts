import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { StoreModel } from './store.model';
import { UserModel } from './user.model';
import { RoleModel } from './role.model';

@Table({
  tableName: 'user_store_roles',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export class UserStoreRoleModel extends Model<UserStoreRoleModel> {
  @ForeignKey(() => UserModel)
  @Column
  user_id: number;

  @ForeignKey(() => StoreModel)
  @Column
  store_id: number;

  @ForeignKey(() => RoleModel)
  @Column
  role_id: number;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @BelongsTo(() => StoreModel)
  store: StoreModel;

  @BelongsTo(() => RoleModel)
  role: RoleModel;
}
