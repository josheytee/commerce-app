import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';
import { OrderModel } from './order.model';
import { ProductVariantModel } from './product-variant.model';
import { VendorModel } from './vendor.model';
@Table({
  timestamps: true,
  underscored: true,
  // paranoid: true,
  tableName: 'order_items',
})
export class OrderItemModel extends Model<OrderItemModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => OrderModel)
  @Column
  order_id: number;

  @BelongsTo(() => OrderModel)
  order: OrderModel;

  @ForeignKey(() => VendorModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  vendor_id: number;

  @BelongsTo(() => VendorModel)
  vendor: VendorModel;

  @BelongsTo(() => ProductVariantModel)
  variant: ProductVariantModel;

  @ForeignKey(() => ProductVariantModel)
  @Column
  product_variant_id: number;

  @Column
  quantity: number;

  @Column
  price: number;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
