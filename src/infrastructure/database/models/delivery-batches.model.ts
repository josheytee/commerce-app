import { Model } from 'sequelize';
import {
    AutoIncrement,
    Column,
    DataType,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';

@Table({ tableName: 'delivery_batches', timestamps: true })
export class DeliveryBatchModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    rider_id: number;

    @Column(DataType.ENUM('pending', 'active', 'completed'))
    status: string;
}
