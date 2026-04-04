import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { OrderModel } from './order.model';
import { StoreModel } from './store.model';
import { FulfillmentStatusEnum } from 'src/shared';

@Table({
  tableName: 'fulfillments',
})
export class FulfillmentModel extends Model<FulfillmentModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => OrderModel)
  @Column
  order_id: number;

  @ForeignKey(() => StoreModel)
  @Column
  store_id: number;

  @Column({
    type: DataType.ENUM(...Object.values(FulfillmentStatusEnum)),
    allowNull: false,
  })
  status: FulfillmentStatusEnum;

  @Column
  tracking_number: string;
}
