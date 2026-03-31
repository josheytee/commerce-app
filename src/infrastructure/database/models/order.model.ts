import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { OrderItemModel } from './order-item.model';
import { CustomerModel } from 'src/infrastructure/database/models/customer.model';

@Table({
  timestamps: true,
  underscored: true,
  paranoid: true,
  tableName: 'orders',
})
export class OrderModel extends Model<OrderModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  order_reference: string;

  @ForeignKey(() => CustomerModel)
  @Column
  customer_id: number;

  @BelongsTo(() => CustomerModel)
  customer: CustomerModel;

  @Column
  total_amount: number;

  @Column
  status: string;

  @HasMany(() => OrderItemModel)
  orderItems: OrderItemModel[];

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
