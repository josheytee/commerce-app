import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { Address } from 'src/modules/user/addresses/address.model';
import { Cart } from 'src/modules/storefront/cart/models/cart.model';
import { User } from '../user/models/user.model';

@Table({
  timestamps: true,
  underscored: true,
  // paranoid: true,
  tableName: 'customers',
})
export class Customer extends Model<Customer> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => User)
  user: User;

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

  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;

  // @Column({ type: DataType.JSONB })
  // metadata: Record<string, any>;
  @HasMany(() => Address, {
    foreignKey: 'addressable_id',
    constraints: false,
    scope: {
      addressable_type: 'customer',
    },
  })
  addresses: Address[];

  @HasMany(() => Cart)
  carts: Cart[];

  async getDefaultAddress() {
    return Address.findOne({
      where: {
        addressable_id: this.id,
        addressable_type: 'customer',
        is_default: true,
      },
    });
  }
}
