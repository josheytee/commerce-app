import {
  Model,
  BelongsTo,
  Table,
  PrimaryKey,
  AutoIncrement,
  Column,
  ForeignKey,
  AllowNull,
  Default,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { FulfillmentTypeEnum } from 'src/shared';
import { CartModel } from './cart.model';
import { InventoryReservationModel } from './inventory-reservation.model';
import { ProductVariantModel } from './product-variant.model';
import { ServiceBookingModel } from './service-booking.model';
import { StoreModel } from './store.model';
import { ProductModel } from './product.model';

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'cart_items',
  indexes: [
    { fields: ['cart_id'], name: 'ci_cart_idx' },
    { fields: ['reservation_expires_at'], name: 'ci_expiry_idx' },
  ],
})
export class CartItemModel extends Model<CartItemModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => CartModel)
  @AllowNull(false)
  @Column
  cart_id: number;

  @BelongsTo(() => CartModel)
  cart: CartModel;

  @ForeignKey(() => ProductModel)
  @Column
  product_id: number;

  @BelongsTo(() => ProductModel)
  product: ProductModel;

  @ForeignKey(() => ProductVariantModel)
  @AllowNull(false)
  @Column
  variant_id: number;

  @BelongsTo(() => ProductVariantModel)
  variant: ProductVariantModel;

  @ForeignKey(() => StoreModel)
  @AllowNull(false)
  @Column
  store_id: number;

  @BelongsTo(() => StoreModel)
  store: StoreModel;

  @AllowNull(false)
  @Default(1)
  @Column({ type: DataType.INTEGER })
  quantity: number;

  @Column({
    type: DataType.ENUM(...Object.values(FulfillmentTypeEnum)),
  })
  item_type: FulfillmentTypeEnum;

  @ForeignKey(() => ServiceBookingModel)
  @Column
  service_booking_id: number;

  @BelongsTo(() => ServiceBookingModel)
  service_booking: ServiceBookingModel;

  @ForeignKey(() => InventoryReservationModel)
  @Column
  inventory_reservation_id: number;

  @BelongsTo(() => InventoryReservationModel)
  inventory_reservation: InventoryReservationModel;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;
}
