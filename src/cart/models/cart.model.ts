import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Customer } from 'src/account/customer/customer.model';

@Table({
  tableName: 'carts',
  underscored: true,
  timestamps: true,
})
export class Cart extends Model<Cart> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Customer)
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

  @BelongsTo(() => Customer)
  customer: Customer;
}
