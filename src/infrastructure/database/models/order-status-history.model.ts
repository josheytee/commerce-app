// ============================================================
// ORDER STATUS HISTORY (Audit trail)

import {
    Table,
    PrimaryKey,
    Model,
    BelongsTo,
    AutoIncrement,
    Column,
    ForeignKey,
    AllowNull,
    DataType,
    CreatedAt,
} from 'sequelize-typescript';
import { OrderModel } from './order.model';

// ============================================================
@Table({
    timestamps: true,
    underscored: true,
    tableName: 'order_status_history',
    indexes: [
        { fields: ['order_id', 'created_at'], name: 'osh_order_created_idx' },
    ],
})
export class OrderStatusHistoryModel extends Model<OrderStatusHistoryModel> {
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

    @AllowNull(false)
    @Column({ type: DataType.STRING(30) })
    status: string;

    @Column({ type: DataType.TEXT })
    notes: string;

    @Column({ type: DataType.STRING(20) })
    actor_type: string;

    @Column
    actor_id: number;

    @CreatedAt
    @Column({ field: 'created_at' })
    created_at: Date;
}
