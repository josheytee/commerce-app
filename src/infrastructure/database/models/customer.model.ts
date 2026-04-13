import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { AddressModel } from './address.model';
import { CartModel } from './cart.model';
import { UserModel } from './user.model';

@Table({
  timestamps: true,
  underscored: true,
  // paranoid: true,
  tableName: 'customers',
})
export class CustomerModel extends Model<CustomerModel> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  default_address_id: number;

  // JSON or another format to store user preferences (e.g., preferred payment methods, saved items).
  // @Column({ type: DataType.JSONB })
  // preferences: Record<string, any>;

  @Column({ type: DataType.STRING })
  status: string;

  // @Column({ type: DataType.JSONB })
  // metadata: Record<string, any>;
  @HasMany(() => AddressModel, {
    foreignKey: 'addressable_id',
    constraints: false,
    scope: {
      addressable_type: 'customer',
    },
  })
  addresses: AddressModel[];

  @HasMany(() => CartModel)
  carts: CartModel[];

  async getDefaultAddress() {
    return AddressModel.findOne({
      where: {
        addressable_id: this.id,
        addressable_type: 'customer',
        is_default: true,
      },
    });
  }
}
