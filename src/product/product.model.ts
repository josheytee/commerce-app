import {
  Table,
  Column,
  Model,
  HasMany,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Inventory } from 'src/inventory/inventory.model';
import { Section } from 'src/section/section.model';
import { Store } from 'src/store/models/store.model';

@Table({
  timestamps: true,
  underscored: true,
  paranoid: true,
  tableName: 'products',
})
export class Product extends Model<Product> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  slug: string;

  @Column
  description: string;

  @Column
  details: string;

  @Column
  quantity: number;

  // @Column
  // featured: boolean;

  // @Column
  // review_able: boolean;

  @Column
  price: number;

  @Column
  status: string;

  @ForeignKey(() => Section)
  @Column
  section_id: number;

  @BelongsTo(() => Section)
  section: Section;

  @ForeignKey(() => Store)
  @Column
  store_id: number;

  @BelongsTo(() => Store)
  store: Store;

  @HasMany(() => Inventory)
  inventories: Inventory[];
}
