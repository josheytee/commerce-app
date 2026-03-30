import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
  DataType,
} from 'sequelize-typescript';
import { Inventory } from 'src/modules/vendor/inventory/inventory.model';
import { StoreCustomer } from './store-customer.model';
import { Store as IStore } from '../interfaces/store.interface';
import { Section } from 'src/modules/vendor/section/section.model';
import { Address } from 'src/modules/user/addresses/address.model';
import { Vendor } from '../../onboarding/vendor.model';
import { Customer } from 'src/modules/user/customer/customer.model';
import { UserStoreRole } from './user-store-role.model';
import { Role } from 'src/modules/user/role/models/role.model';

@Table({
  timestamps: true,
  underscored: true,
  // paranoid: true,
  tableName: 'stores',
})
export class Store extends Model<Store> implements IStore {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  description: string;

  @ForeignKey(() => Address)
  @Column
  address_id: number;

  @BelongsTo(() => Address)
  address: Address;

  @ForeignKey(() => Vendor)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  vendor_id: number;

  @BelongsTo(() => Vendor)
  vendor: Vendor;

  @BelongsToMany(() => Customer, () => StoreCustomer)
  customers: Customer[];

  @HasMany(() => Section)
  sections: Section[];

  @HasMany(() => Inventory)
  inventories: Inventory[];

  @BelongsToMany(() => Role, () => UserStoreRole)
  roles: Role[];
}
