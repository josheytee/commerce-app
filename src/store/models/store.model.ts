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
import { Inventory } from 'src/inventory/inventory.model';
import { Customer } from '../../account/customer/customer.model';
import { StoreCustomer } from './store-customer.model';
import { Vendor } from 'src/account/vendor/vendor.model';
import { Section } from 'src/section/section.model';
import { Store as IStore } from '../interfaces/store.interface';
import { Category } from './category.model';

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

  @ForeignKey(() => Category)
  @Column
  category_id: number;

  @BelongsTo(() => Category)
  category: Category;

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
