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
import { OrderItem } from './order-item.model';
import { Customer } from 'src/account/customer/customer.model';

@Table({
  timestamps: true,
  underscored: true,
  paranoid: true,
  tableName: 'orders',
})
export class Order extends Model<Order> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  order_reference: string;

  @ForeignKey(() => Customer)
  @Column
  customer_id: number;

  @BelongsTo(() => Customer)
  customer: Customer;

  @Column
  total_amount: number;

  @Column
  status: string;

  @HasMany(() => OrderItem)
  orderItems: OrderItem[];

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
