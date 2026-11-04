import {
  Table,
  Model,
  BelongsTo,
  HasMany,
  PrimaryKey,
  AutoIncrement,
  Column,
  ForeignKey,
  DataType,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { CartStatusEnum } from 'src/shared';
import { CartItemModel } from './cart-item.model';
import { CustomerModel } from './customer.model';

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'carts',
  indexes: [
    { fields: ['customer_id', 'status'], name: 'carts_customer_status_idx' },
    { fields: ['session_token'], name: 'carts_session_idx' },
    { fields: ['expires_at'], name: 'carts_expiry_idx' },
  ],
})
export class CartModel extends Model<CartModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => CustomerModel)
  @Column
  customer_id: number;

  @BelongsTo(() => CustomerModel)
  customer: CustomerModel;

  @Column({ type: DataType.STRING(255), unique: true })
  session_token: string;

  @Default(CartStatusEnum.ACTIVE)
  @Column({
    type: DataType.ENUM(...Object.values(CartStatusEnum)),
  })
  status: CartStatusEnum;

  @Column({ type: DataType.DATE })
  expires_at: Date;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;

  @HasMany(() => CartItemModel, { foreignKey: 'cart_id', as: 'items' })
  items: CartItemModel[];
}
