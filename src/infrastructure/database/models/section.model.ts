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
import { StoreModel } from './store.model';
import { ProductModel } from './product.model';

@Table({
  timestamps: true,
  underscored: true,
  // paranoid: true,
  tableName: 'sections',
})
export class SectionModel extends Model<SectionModel> {
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

  // @Column
  // status: string;

  @ForeignKey(() => SectionModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  parent_id: number;

  @BelongsTo(() => SectionModel, { onDelete: 'CASCADE' })
  parent: SectionModel;

  @ForeignKey(() => StoreModel)
  @Column
  store_id: number;

  @BelongsTo(() => StoreModel)
  store: StoreModel;

  @HasMany(() => SectionModel)
  children: SectionModel[];

  @HasMany(() => ProductModel)
  products: ProductModel[];
}
