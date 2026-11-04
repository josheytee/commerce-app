import {
  Table,
  PrimaryKey,
  AutoIncrement,
  Column,
  AllowNull,
  DataType,
  ForeignKey,
  Default,
  CreatedAt,
  UpdatedAt,
  Model,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { CustomerModel } from './customer.model';
import { OrderItemModel } from './order-item.model';
import { OrderStatusHistoryModel } from './order-status-history.model';
import { RefundModel } from './refund.model';
import { ShipmentModel } from './shipments.model';
import { StoreModel } from './store.model';
import { VendorModel } from './vendor.model';
import { CheckoutSessionModel } from './checkout-session.model';
import { OrderStatusEnum } from 'src/shared';

export enum FulfillmentModeEnum {
  DELIVERY = 'delivery',
  PICKUP = 'pickup',
  DIGITAL = 'digital',
  APPOINTMENT = 'appointment',
}

export interface CustomerSnapshot {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface StoreSnapshot {
  id: number;
  name: string;
  vendor_id: number;
  vendor_name: string;
}

export interface AddressSnapshot {
  name: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  lat?: number;
  lng?: number;
}

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'orders',
  version: true, // 🟢 FIX: Moves optimistic locking configuration to the table options block!
  indexes: [
    { fields: ['checkout_session_id'], name: 'orders_session_idx' },
    { fields: ['customer_id'], name: 'orders_customer_idx' },
    { fields: ['vendor_id', 'status'], name: 'orders_vendor_status_idx' },
    { fields: ['store_id', 'status'], name: 'orders_store_status_idx' },
    { fields: ['order_reference'], name: 'orders_reference_idx' },
    { fields: ['created_at'], name: 'orders_created_at_idx' },
  ],
})
export class OrderModel extends Model<OrderModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(50), unique: true })
  order_reference: string;

  // ============ FOREIGN KEYS ============

  @ForeignKey(() => CheckoutSessionModel)
  @AllowNull(false)
  @Column({ onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  checkout_session_id: number;

  @BelongsTo(() => CheckoutSessionModel)
  checkout_session: CheckoutSessionModel;

  @ForeignKey(() => CustomerModel)
  @AllowNull(false)
  @Column({ onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  customer_id: number;

  @BelongsTo(() => CustomerModel)
  customer: CustomerModel;

  @ForeignKey(() => VendorModel)
  @AllowNull(false)
  @Column({ onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  vendor_id: number;

  @BelongsTo(() => VendorModel)
  vendor: VendorModel;

  @ForeignKey(() => StoreModel)
  @AllowNull(false)
  @Column({ onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  store_id: number;

  @BelongsTo(() => StoreModel)
  store: StoreModel;

  // ============ STATUS & CONCURRENCY LOCKING ============

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  version: number;

  @AllowNull(false)
  @Default(OrderStatusEnum.PENDING_PAYMENT)
  @Column({ type: DataType.ENUM(...Object.values(OrderStatusEnum)) })
  status: OrderStatusEnum;

  // ============ FINANCIALS ============

  @AllowNull(false)
  @Column({ type: DataType.DECIMAL(12, 2) })
  subtotal: string;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.DECIMAL(12, 2) })
  tax_amount: string;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.DECIMAL(12, 2) })
  shipping_amount: string;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.DECIMAL(12, 2) })
  handling_fee: string;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.DECIMAL(12, 2) })
  discount_amount: string;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.DECIMAL(12, 2),
    comment: 'Marketplace commission taken at capture',
  })
  platform_fee: string;

  @AllowNull(false)
  @Column({ type: DataType.DECIMAL(12, 2) })
  total_amount: string;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.DECIMAL(12, 2) })
  amount_paid: string;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.DECIMAL(12, 2) })
  amount_refunded: string;

  @AllowNull(false)
  @Default('USD')
  @Column({ type: DataType.STRING(3) })
  currency: string;

  // ============ IMMUTABLE SNAPSHOTS ============

  @AllowNull(false)
  @Column({ type: DataType.JSONB }) // 🟢 OPTIMIZED: Groups customer profile parameters cleanly
  customer_snapshot: CustomerSnapshot;

  @AllowNull(false)
  @Column({ type: DataType.JSONB }) // 🟢 OPTIMIZED: Groups merchant details cleanly
  store_snapshot: StoreSnapshot;

  @AllowNull(true)
  @Column({ type: DataType.JSONB })
  shipping_address_snapshot: AddressSnapshot | null;

  @AllowNull(true)
  @Column({ type: DataType.JSONB })
  billing_address_snapshot: AddressSnapshot | null;

  // ============ FULFILLMENT MODE ============

  @AllowNull(false)
  @Default(FulfillmentModeEnum.DELIVERY)
  @Column({ type: DataType.ENUM(...Object.values(FulfillmentModeEnum)) })
  fulfillment_mode: FulfillmentModeEnum;

  // ============ MILESTONE TIMELINE ============

  @AllowNull(true) @Column({ type: DataType.DATE }) paid_at: Date | null;
  @AllowNull(true) @Column({ type: DataType.DATE }) confirmed_at: Date | null;
  @AllowNull(true) @Column({ type: DataType.DATE }) shipped_at: Date | null;
  @AllowNull(true) @Column({ type: DataType.DATE }) delivered_at: Date | null;
  @AllowNull(true) @Column({ type: DataType.DATE }) completed_at: Date | null;
  @AllowNull(true) @Column({ type: DataType.DATE }) cancelled_at: Date | null;
  @AllowNull(true)
  @Column({ type: DataType.DATE })
  fulfillment_deadline: Date | null;

  // ============ COMMUNICATIONS & INFO ============

  @AllowNull(true) @Column({ type: DataType.TEXT }) customer_notes:
    | string
    | null;
  @AllowNull(true) @Column({ type: DataType.TEXT }) vendor_notes: string | null;
  @AllowNull(true) @Column({ type: DataType.TEXT }) internal_notes:
    | string
    | null;

  @AllowNull(true)
  @Column({ type: DataType.JSONB })
  metadata: Record<string, unknown> | null;

  // ============ RELATIONSHIPS ============

  @HasMany(() => OrderItemModel, { foreignKey: 'order_id', as: 'items' })
  items: OrderItemModel[];

  @HasMany(() => ShipmentModel, { foreignKey: 'order_id', as: 'shipments' })
  shipments: ShipmentModel[];

  @HasMany(() => RefundModel, { foreignKey: 'order_id', as: 'refunds' })
  refunds: RefundModel[];

  @HasMany(() => OrderStatusHistoryModel, {
    foreignKey: 'order_id',
    as: 'status_history',
  })
  status_history: OrderStatusHistoryModel[];

  @CreatedAt @Column({ field: 'created_at' }) created_at: Date;
  @UpdatedAt @Column({ field: 'updated_at' }) updated_at: Date;
}
