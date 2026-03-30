import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Cart } from './cart.model';
import { Product } from 'src/modules/vendor/products/product.model';

@Table({
  tableName: 'cart_items',
  underscored: true,
  timestamps: true,
})
export class CartItem extends Model<CartItem> {
  @ForeignKey(() => Cart)
  @Column
  cart_id: number;

  @ForeignKey(() => Product)
  @Column
  product_id: number;

  @Column
  quantity: number;

  @BelongsTo(() => Cart)
  cart: Cart;

  @BelongsTo(() => Product)
  product: Product;
}
