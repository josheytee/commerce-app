import {
  Table,
  Column,
  Model,
  HasMany,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Inventory } from 'src/inventory/inventory.model';
import { Section } from 'src/store/section/section.model';

@Table({ tableName: 'products' })
export class Product extends Model<Product> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  description: string;

  @Column
  price: number;

  @ForeignKey(() => Section)
  @Column
  section_id: number;

  @BelongsTo(() => Section)
  section: Section;

  @HasMany(() => Inventory)
  inventories: Inventory[];

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
