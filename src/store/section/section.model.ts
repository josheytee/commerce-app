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

@Table({
  timestamps: true,
  underscored: true,
  // paranoid: true,
  tableName: 'sections',
})
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
}
