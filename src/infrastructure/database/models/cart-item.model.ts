import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { CartModel } from './cart.model';
import { ProductVariantModel } from './product-variant.model';
import { StoreModel } from './store.model';

@Table({
  tableName: 'cart_items',
  underscored: true,
  timestamps: true,
})
export class CartItemModel extends Model<CartItemModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => CartModel)
  @Column
  cart_id: number;

  @ForeignKey(() => ProductVariantModel)
  @Column
  product_variant_id: number;

  @ForeignKey(() => StoreModel)
  @Column
  store_id: number;

  @Column
  quantity: number;

  @BelongsTo(() => CartModel)
  cart: CartModel;

  @BelongsTo(() => StoreModel)
  store: StoreModel;

  @BelongsTo(() => ProductVariantModel)
  product: ProductVariantModel;
}
