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
import { Store } from '../models/store.model';
import { Product } from '../../product/product.model';

@Table({ tableName: 'sections' })
export class Section extends Model<Section> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Store)
  @Column
  store_id: number;

  @BelongsTo(() => Store)
  store: Store;

  @Column
  name: string;

  @Column
  description: string;

  @HasMany(() => Product)
  products: Product[];

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
