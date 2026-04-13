import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { FulfillmentModel } from './fulfillment.model';
import { OrderItemModel } from './order-item.model';

@Table({
  tableName: 'fulfillment_items',
})
export class FulfillmentItemModel extends Model<FulfillmentItemModel> {
  @ForeignKey(() => FulfillmentModel)
  @Column
  fulfillment_id: number;

  @BelongsTo(() => FulfillmentModel)
  fulfillment: FulfillmentModel;

  @ForeignKey(() => OrderItemModel)
  @Column
  order_item_id: number;

  @BelongsTo(() => OrderItemModel)
  orderItem: OrderItemModel;

  @Column
  quantity: number;
}
