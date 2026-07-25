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
import { CartStatusEnum } from 'src/shared';

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
    type: DataType.ENUM,
    values: Object.values(CartStatusEnum),
    defaultValue: CartStatusEnum.ACTIVE,
  })
  status: CartStatusEnum;

  @HasMany(() => CartItemModel)
  items: CartItemModel[];

  @BelongsTo(() => CustomerModel)
  customer: CustomerModel;
}
