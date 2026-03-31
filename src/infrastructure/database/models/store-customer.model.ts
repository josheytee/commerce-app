import {
  Column,
  Model,
  Table,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { StoreModel } from './store.model';
import { CustomerModel } from 'src/infrastructure/database/models/customer.model';

@Table
export class StoreCustomer extends Model<StoreCustomer> {
  @ForeignKey(() => StoreModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  store_id: number;

  @ForeignKey(() => CustomerModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  customer_id: number;
}
