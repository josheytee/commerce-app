import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
  HasMany,
  AutoIncrement,
  PrimaryKey,
} from 'sequelize-typescript';
import { CustomerModel } from 'src/infrastructure/database/models/customer.model';
import { CartItemModel } from './cart-item.model';

@Table({
  tableName: 'carts',
  underscored: true,
  timestamps: true,
})
export class CartModel extends Model<CartModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => CustomerModel)
  @Column
  customer_id: number;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  items: object;

  @HasMany(() => CartItemModel)
  cartItems: CartItemModel[];

  @BelongsTo(() => CustomerModel)
  customer: CustomerModel;
}
