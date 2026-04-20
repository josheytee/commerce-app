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
  DataType,
  Default,
} from 'sequelize-typescript';
import { OrderItemModel } from './order-item.model';
import { CustomerModel } from 'src/infrastructure/database/models/customer.model';
import { VendorModel } from './vendor.model';
import { AddressModel } from './address.model';
import { OrderStatusEnum } from 'src/shared/enums/order.enums';

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

  @ForeignKey(() => VendorModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  vendor_id: number;

  @BelongsTo(() => VendorModel)
  vendor: VendorModel;

  @Column(DataType.DECIMAL)
  total_amount: number;


  @Default(OrderStatusEnum.PENDING)
  @Column({ type: DataType.ENUM(...Object.values(OrderStatusEnum)) })
  status: OrderStatusEnum;

  @Column
  @ForeignKey(() => AddressModel)
  address_id: number;

  @Column(DataType.DECIMAL)
  delivery_fee: number;

  @HasMany(() => OrderItemModel)
  orderItems: OrderItemModel[];

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
