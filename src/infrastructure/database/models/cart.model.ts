import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { CustomerModel } from 'src/infrastructure/database/models/customer.model';

@Table({
  tableName: 'carts',
  underscored: true,
  timestamps: true,
})
export class CartModel extends Model<CartModel> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => CustomerModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  customer_id: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  items: object;

  @BelongsTo(() => CustomerModel)
  customer: CustomerModel;
}
