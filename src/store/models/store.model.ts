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
} from 'sequelize-typescript';
import { Section } from '../section/section.model';
import { Inventory } from 'src/inventory/inventory.model';
import { Customer } from '../../account/customer/customer.model';
import { StoreCustomer } from './store-customer.model';
import { Vendor } from 'src/account/vendor/vendor.model';

@Table({
  timestamps: true,
  underscored: true,
  // paranoid: true,
  tableName: 'stores',
})
export class Store extends Model<Store> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  description: string;

  @ForeignKey(() => Vendor)
  @Column
  vendor_id: number;

  @BelongsTo(() => Vendor)
  vendor: Vendor;

  @BelongsToMany(() => Customer, () => StoreCustomer)
  customers: Customer[];

  @HasMany(() => Section)
  sections: Section[];

  @HasMany(() => Inventory)
  inventories: Inventory[];
}
