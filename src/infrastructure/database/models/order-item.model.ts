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
} from 'sequelize-typescript';
import { OrderModel } from './order.model';
import { ProductModel } from './product.model';
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

  @ForeignKey(() => ProductModel)
  @Column
  product_id: number;

  @BelongsTo(() => ProductModel)
  product: ProductModel;

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
