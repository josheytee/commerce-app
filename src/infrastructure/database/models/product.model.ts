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
import { SectionModel } from './section.model';
import { StoreModel } from './store.model';
import { InventoryModel } from './inventory.model';


@Table({
  timestamps: true,
  underscored: true,
  paranoid: true,
  tableName: 'products',
})
export class ProductModel extends Model<ProductModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  slug: string;

  // @Column
  // description: string;

  @Column
  details: string;

  // @Column
  // quantity: number;

  // @Column
  // featured: boolean;

  // @Column
  // review_able: boolean;

  @Column
  price: number;

  // @Column
  // status: string;

  @ForeignKey(() => SectionModel)
  @Column
  section_id: number;

  @BelongsTo(() => SectionModel)
  section: SectionModel;

  @ForeignKey(() => StoreModel)
  @Column
  store_id: number;

  @BelongsTo(() => StoreModel)
  store: StoreModel;

  @HasMany(() => InventoryModel)
  inventories: InventoryModel[];
}
