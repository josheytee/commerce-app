// ============================================================
// SHIPMENT (Child table — replaces fulfillment_details JSONB)

import {
    Table,
    PrimaryKey,
    AutoIncrement,
    Column,
    ForeignKey,
    AllowNull,
    DataType,
    CreatedAt,
    UpdatedAt,
    Model,
    BelongsTo,
    HasMany,
} from 'sequelize-typescript';
import { OrderModel } from './order.model';
import { ShipmentEventModel } from './shipment-events.model';

// ============================================================
@Table({
    timestamps: true,
    underscored: true,
    tableName: 'shipments',
    indexes: [
        { fields: ['order_id'], name: 'shipments_order_idx' },
        { fields: ['tracking_number'], name: 'shipments_tracking_idx' },
        { fields: ['status'], name: 'shipments_status_idx' },
    ],
})
export class ShipmentModel extends Model<ShipmentModel> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => OrderModel)
    @AllowNull(false)
    @Column
    order_id: number;

    @BelongsTo(() => OrderModel)
    order: OrderModel;

    @Column({ type: DataType.STRING(100) })
    carrier: string;

    @Column({ type: DataType.STRING(100) })
    tracking_number: string;

    @Column({ type: DataType.TEXT })
    tracking_url: string;

    @Column({
        type: DataType.ENUM(
            'pending',
            'label_created',
            'picked_up',
            'in_transit',
            'out_for_delivery',
            'delivered',
            'failed',
        ),
    })
    status: string;

    @Column({ type: DataType.DATE })
    estimated_delivery: Date;

    @Column({ type: DataType.DATE })
    actual_delivery: Date;

    @Column({ type: DataType.DECIMAL(10, 2) })
    weight_g: number;

    @Column({ type: DataType.JSONB })
    dimensions_cm: { l: number; w: number; h: number };

    @CreatedAt
    @Column({ field: 'created_at' })
    created_at: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updated_at: Date;

    @HasMany(() => ShipmentEventModel, {
        foreignKey: 'shipment_id',
        as: 'events',
    })
    events: ShipmentEventModel[];
}
