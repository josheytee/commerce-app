// src/infrastructure/database/models/order-item.model.ts
import {
  Table,
  PrimaryKey,
  AutoIncrement,
  Column,
  ForeignKey,
  AllowNull,
  DataType,
  Default,
  CreatedAt,
  UpdatedAt,
  Model,
  BelongsTo,
} from 'sequelize-typescript';
import { FulfillmentTypeEnum, OrderItemStatusEnum } from 'src/shared';
import { OrderModel } from './order.model';
import { ProductVariantModel } from './product-variant.model';
import { ServiceBookingModel } from './service-booking.model';
import { DigitalDeliveryModel } from './digital-deliveries.model';
import { InventoryReservationModel } from './inventory-reservation.model';
import { StoreModel } from './store.model';

export interface ProductVariantSnapshot {
  product_id: number;
  product_name: string;
  variant_name: string;
  sku: string;
  image_url?: string;
  weight_g?: string;
  attributes?: Record<string, any>;
}

export interface OrderItemMetadata {
  notes?: string;
  gift_wrap?: boolean;
  gift_message?: string;
  custom_options?: Record<string, any>;
}

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'order_items',
  indexes: [
    { fields: ['order_id'], name: 'oi_order_idx' },
    { fields: ['variant_id'], name: 'oi_variant_idx' },
    { fields: ['status'], name: 'oi_status_idx' },
  ],
})
export class OrderItemModel extends Model<OrderItemModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  // ============ FOREIGN KEYS ============

  @ForeignKey(() => OrderModel)
  @AllowNull(false)
  @Column({ onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  order_id: number;

  @BelongsTo(() => OrderModel)
  order: OrderModel;

  @ForeignKey(() => ProductVariantModel)
  @AllowNull(false)
  @Column({ onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  variant_id: number;

  @BelongsTo(() => ProductVariantModel)
  variant: ProductVariantModel;

  @ForeignKey(() => StoreModel)
  @AllowNull(false)
  @Column({ onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  store_id: number;

  @BelongsTo(() => StoreModel)
  store: StoreModel;

  // ============ IMMUTABLE COMPOSITE SNAPSHOT ============

  @AllowNull(false)
  @Column({ type: DataType.JSONB }) // 🟢 CONSOLIDATED: Groups name, variant, attributes, weight, and SKU into a single JSONB snapshot block
  product_variant_snapshot: ProductVariantSnapshot;

  // ============ QUANTITY CALCULATORS ============

  @AllowNull(false)
  @Default(1)
  @Column({ type: DataType.INTEGER })
  quantity: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  fulfilled_quantity: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  refunded_quantity: number;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.INTEGER })
  cancelled_quantity: number;

  // ============ FINANCIAL TRACKING (Mapped to strings for Decimal safety) ============

  @AllowNull(false)
  @Column({ type: DataType.DECIMAL(12, 2) })
  unit_price: string; // 🟢 FIX: Strings preserve precise decimal representation without floating-point drift

  @AllowNull(true)
  @Column({ type: DataType.DECIMAL(12, 2) })
  compare_at_price_snapshot: string | null;

  @AllowNull(false)
  @Column({ type: DataType.DECIMAL(12, 2) })
  total_price: string;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.DECIMAL(12, 2) })
  discount_amount: string;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.DECIMAL(12, 2) })
  tax_amount: string;

  // ============ STATE FLAVORS ============

  @AllowNull(false)
  @Default(FulfillmentTypeEnum.PHYSICAL)
  @Column({ type: DataType.ENUM(...Object.values(FulfillmentTypeEnum)) })
  fulfillment_type: FulfillmentTypeEnum;

  @AllowNull(false)
  @Default(OrderItemStatusEnum.PENDING)
  @Column({ type: DataType.ENUM(...Object.values(OrderItemStatusEnum)) })
  status: OrderItemStatusEnum;

  // ============ POLYMORPHIC / TYPE-SPECIFIC RELATION LINKS ============

  @ForeignKey(() => ServiceBookingModel)
  @AllowNull(true)
  @Column({ onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  service_booking_id: number | null;

  @BelongsTo(() => ServiceBookingModel)
  service_booking: ServiceBookingModel | null;

  @ForeignKey(() => DigitalDeliveryModel)
  @AllowNull(true)
  @Column({ onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  digital_delivery_id: number | null;

  @BelongsTo(() => DigitalDeliveryModel)
  digital_delivery: DigitalDeliveryModel | null;

  @ForeignKey(() => InventoryReservationModel)
  @AllowNull(true)
  @Column({ onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  inventory_reservation_id: number | null;

  @BelongsTo(() => InventoryReservationModel)
  inventory_reservation: InventoryReservationModel | null;

  // ============ COMPOSITE EXTRA DATA ============

  @AllowNull(true)
  @Column({ type: DataType.JSONB })
  metadata: OrderItemMetadata | null;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;

  // ============ IN-MEMORY GETTERS ============

  get remaining_quantity(): number {
    return (
      this.quantity -
      this.fulfilled_quantity -
      this.refunded_quantity -
      this.cancelled_quantity
    );
  }

  get is_fully_fulfilled(): boolean {
    return this.fulfilled_quantity >= this.quantity;
  }
}
