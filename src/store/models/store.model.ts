import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Vendor } from '../vendor/vendor.model';
import { Section } from '../section/section.model';
import { Inventory } from 'src/inventory/inventory.model';

@Table({ tableName: 'stores' })
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

  @HasMany(() => Section)
  sections: Section[];

  @HasMany(() => Inventory)
  inventories: Inventory[];

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
