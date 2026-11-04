// ============================================================
// CHECKOUT SESSION (Payment Shell)
// ============================================================
// One checkout = one payment attempt. Spawns N orders.
//
// - checkout_reference:     customer-facing reference (shown on receipt)
// - payment_provider_reference: gateway's tx_ref (Paystack/Flutterwave)
// - total_amount:           amount actually charged to the customer
// - payment_status:         lifecycle of the payment (not fulfillment)
//
// Idempotency key: client sends a UUID on "Pay" click; reused across retries.

import {
    Table,
    Model,
    BelongsTo,
    HasMany,
    PrimaryKey,
    AutoIncrement,
    Column,
    AllowNull,
    DataType,
    ForeignKey,
    Default,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';
import {
    PaymentStatusEnum,
    PaymentMethodEnum,
    PaymentProviderEnum,
} from 'src/shared/enums';
import { CartModel } from './cart.model';
import { CustomerModel } from './customer.model';
import { OrderModel } from './order.model';

export interface CheckoutMetadata {
    ip_address?: string;
    user_agent?: string;
    device_type?: string;
    affiliate_id?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
}

@Table({
    timestamps: true,
    underscored: true,
    tableName: 'checkout_sessions',
    indexes: [
        { fields: ['customer_id'], name: 'cs_customer_idx' },
        { fields: ['cart_id'], name: 'cs_cart_idx' },
        { fields: ['payment_status'], name: 'cs_payment_status_idx' },
        {
            fields: ['payment_provider', 'payment_reference'],
            name: 'cs_provider_ref_idx',
        },
        { fields: ['created_at'], name: 'cs_created_at_idx' },
        // idempotency_key uniqueness comes from `unique: true` on the column
    ],
})
export class CheckoutSessionModel extends Model<CheckoutSessionModel> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    // ============ REFERENCES ============

    @AllowNull(false)
    @Column({ type: DataType.STRING(100), unique: true })
    idempotency_key: string;

    @AllowNull(false)
    @Column({ type: DataType.STRING(50), unique: true })
    checkout_reference: string;

    @ForeignKey(() => CustomerModel)
    @AllowNull(false)
    @Column({ onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
    customer_id: number;

    @BelongsTo(() => CustomerModel, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    })
    customer: CustomerModel;

    @ForeignKey(() => CartModel)
    @AllowNull(false)
    @Column({ onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
    cart_id: number;

    @BelongsTo(() => CartModel, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    })
    cart: CartModel;

    // ============ FINANCIALS ============
    // Sequelize returns DECIMAL as string. Types reflect runtime reality.
    // Consider moving to BIGINT minor units if you want a cleaner refactor.

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
    discount_amount: string;

    @AllowNull(false)
    @Column({ type: DataType.DECIMAL(12, 2) })
    total_amount: string;

    @AllowNull(false)
    @Default(0)
    @Column({ type: DataType.DECIMAL(12, 2) })
    refunded_amount: string;

    @AllowNull(false)
    @Default('USD')
    @Column({ type: DataType.STRING(3) })
    currency: string;

    // ============ PAYMENT ============

    @AllowNull(false)
    @Default(PaymentStatusEnum.PENDING)
    @Column({
        type: DataType.ENUM(...Object.values(PaymentStatusEnum)),
    })
    payment_status: PaymentStatusEnum;

    @AllowNull(true)
    @Column({ type: DataType.ENUM(...Object.values(PaymentProviderEnum)) })
    payment_provider: PaymentProviderEnum | null;

    @AllowNull(true)
    @Column({ type: DataType.ENUM(...Object.values(PaymentMethodEnum)) })
    payment_method: PaymentMethodEnum | null;

    @AllowNull(true)
    @Column({ type: DataType.STRING(255), unique: true })
    payment_reference: string | null;

    @AllowNull(true)
    @Column({ type: DataType.JSONB })
    payment_metadata: Record<string, unknown> | null;

    @AllowNull(true)
    @Column({ type: DataType.STRING(100) })
    failure_code: string | null;

    @AllowNull(true)
    @Column({ type: DataType.TEXT })
    failure_message: string | null;

    // ============ LIFECYCLE TIMESTAMPS ============

    @AllowNull(true)
    @Column({ type: DataType.DATE })
    paid_at: Date | null;

    @AllowNull(true)
    @Column({ type: DataType.DATE })
    failed_at: Date | null;

    @AllowNull(true)
    @Column({ type: DataType.DATE })
    cancelled_at: Date | null;

    @AllowNull(true)
    @Column({ type: DataType.DATE })
    refunded_at: Date | null;

    @AllowNull(true)
    @Column({ type: DataType.DATE })
    expires_at: Date | null;

    // ============ METADATA ============

    @AllowNull(true)
    @Column({ type: DataType.JSONB })
    metadata: CheckoutMetadata | null;

    // ============ TIMESTAMPS ============

    @CreatedAt
    @Column({ field: 'created_at' })
    created_at: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updated_at: Date;

    // ============ RELATIONSHIPS ============

    @HasMany(() => OrderModel, {
        foreignKey: 'checkout_session_id',
        as: 'orders',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    })
    orders: OrderModel[];
}
