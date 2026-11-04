// ============================================================
// REFUND (Child table — one row per refund line)

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
} from 'sequelize-typescript';
import { OrderModel } from './order.model';

// ============================================================
@Table({
    timestamps: true,
    underscored: true,
    tableName: 'refunds',
    indexes: [
        { fields: ['order_id'], name: 'refunds_order_idx' },
        { fields: ['status'], name: 'refunds_status_idx' },
    ],
})
export class RefundModel extends Model<RefundModel> {
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

    @Column({ type: DataType.DECIMAL(12, 2) })
    amount: number;

    @Column({ type: DataType.STRING(50) })
    reason: string;

    @Column({ type: DataType.TEXT })
    notes: string;

    @Column({ type: DataType.STRING(100) })
    transaction_id: string;

    @Column({
        type: DataType.ENUM('pending', 'processing', 'completed', 'failed'),
    })
    status: string;

    @Column({ type: DataType.JSONB })
    metadata: Record<string, any>;

    @CreatedAt
    @Column({ field: 'created_at' })
    created_at: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updated_at: Date;
}
