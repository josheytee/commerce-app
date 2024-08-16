import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { User } from 'src/account/user/models/user.model';
import { Cart } from 'src/cart/models/cart.model';

@Table({
  timestamps: true,
  underscored: true,
  // paranoid: true,
  tableName: 'customers',
})
export class Customer extends Model<Customer> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Cart)
  carts: Cart[];
}
