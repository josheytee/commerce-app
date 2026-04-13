import {
    AutoIncrement,
    Column,
    DataType,
    Default,
    PrimaryKey,
    Table,
    Model,
} from 'sequelize-typescript';
import { RiderStatusEnum } from 'src/shared';

@Table({ tableName: 'riders', timestamps: true })
export class RiderModel extends Model<RiderModel> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    name: string;

    @Column
    phone: string;

    @Default(RiderStatusEnum.OFFLINE)
    @Column(DataType.ENUM(...Object.values(RiderStatusEnum)))
    status: RiderStatusEnum;

    @Column(DataType.DECIMAL(10, 7))
    current_lat: number;

    @Column(DataType.DECIMAL(10, 7))
    current_lng: number;
}
