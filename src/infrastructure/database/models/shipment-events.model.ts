// ============================================================
// SHIPMENT EVENT (Tracking history — append-only)

import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { ShipmentModel } from './shipments.model';

// ============================================================
@Table({
    timestamps: true,
    underscored: true,
    tableName: 'shipment_events',
    indexes: [
        { fields: ['shipment_id', 'created_at'], name: 'se_shipment_created_idx' },
    ],
})
export class ShipmentEventModel extends Model<ShipmentEventModel> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => ShipmentModel)
    @AllowNull(false)
    @Column
    shipment_id: number;

    @BelongsTo(() => ShipmentModel)
    shipment: ShipmentModel;

    @Column({ type: DataType.STRING(50) })
    status: string;

    @Column({ type: DataType.STRING(255) })
    location: string;

    @Column({ type: DataType.TEXT })
    description: string;

    @Column({ type: DataType.JSONB })
    raw_payload: Record<string, any>;

    @CreatedAt
    @Column({ field: 'created_at' })
    created_at: Date;
}
