import { Model } from 'sequelize';
import {
    AutoIncrement,
    Column,
    DataType,
    Default,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';

@Table({ tableName: 'delivery_tracking', timestamps: true })
export class DeliveryTrackingModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    fulfillment_id: number;

    @Column(DataType.DECIMAL(10, 7))
    lat: number;

    @Column(DataType.DECIMAL(10, 7))
    lng: number;

    @Column(DataType.DATE)
    timestamp: Date;
}
