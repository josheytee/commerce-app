import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
  PrimaryKey,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';
import { Store } from 'src/store/models/store.model';
import { Product } from '../product/product.model';

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

  @Column
  name: string;

  @Column
  slug: string;

  @Column
  cover: string;

  @Column
  description: string;

  @Column
  status: string;

  @ForeignKey(() => Section)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  parent_id: number;

  @BelongsTo(() => Section, { onDelete: 'CASCADE' })
  parent: Section;

  @ForeignKey(() => Store)
  @Column
  store_id: number;

  @BelongsTo(() => Store)
  store: Store;

  @HasMany(() => Section)
  children: Section[];

  @HasMany(() => Product)
  products: Product[];
}
