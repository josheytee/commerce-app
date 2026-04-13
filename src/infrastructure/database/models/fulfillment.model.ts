import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { OrderModel } from './order.model';
import { StoreModel } from './store.model';
import { FulfillmentStatusEnum } from 'src/shared';
import { RiderModel } from './rider.model';
import { VendorModel } from './vendor.model';
import { FulfillmentItemModel } from './fulfillment-item.model';

@Table({
  tableName: 'fulfillments',
  timestamps: true,
  underscored: true,
  paranoid: true,
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
  vendor_id: number;

  @BelongsTo(() => VendorModel)
  vendor: VendorModel;

  @ForeignKey(() => StoreModel)
  @Column
  store_id: number;

  @BelongsTo(() => StoreModel)
  store: StoreModel;

  @ForeignKey(() => RiderModel)
  @Column
  rider_id: number;

  @BelongsTo(() => RiderModel)
  rider: RiderModel;

  @Column({
    type: DataType.ENUM(...Object.values(FulfillmentStatusEnum)),
    allowNull: false,
  })
  status: FulfillmentStatusEnum;

  @Column
  tracking_number: string;

  @HasMany(() => FulfillmentItemModel)
  fulfillmentItems: FulfillmentItemModel[];
}
