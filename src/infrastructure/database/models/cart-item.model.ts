import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { CartModel } from './cart.model';
import { ProductModel } from 'src/infrastructure/database/models/product.model';

@Table({
  tableName: 'cart_items',
  underscored: true,
  timestamps: true,
})
export class CartItemModel extends Model<CartItemModel> {
  @ForeignKey(() => CartModel)
  @Column
  cart_id: number;

  @ForeignKey(() => ProductModel)
  @Column
  product_id: number;

  @Column
  quantity: number;

  @BelongsTo(() => CartModel)
  cart: CartModel;

  @BelongsTo(() => ProductModel)
  product: ProductModel;
}
