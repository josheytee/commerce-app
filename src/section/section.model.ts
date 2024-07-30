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
import { Product } from '../product/product.model';
import { Store } from 'src/store/models/store.model';

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

  @ForeignKey(() => Section)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  parent_id: number;

  @BelongsTo(() => Section, { onDelete: 'CASCADE' })
  parent: Section;

  @HasMany(() => Section)
  children: Section[];

  @HasMany(() => Product)
  products: Product[];
}
