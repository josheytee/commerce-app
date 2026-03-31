import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { StoreModel } from 'src/infrastructure/database/models/store.model';
import { ProductModel } from 'src/infrastructure/database/models/product.model';

@Table({
  timestamps: true,
  underscored: true,
  // paranoid: true,
  tableName: 'inventories',
})
export class InventoryModel extends Model<InventoryModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => StoreModel)
  @Column
  store_id: number;

  @BelongsTo(() => StoreModel)
  store: StoreModel;

  @ForeignKey(() => ProductModel)
  @Column
  product_id: number;

  @BelongsTo(() => ProductModel)
  product: ProductModel;

  @Column
  quantity: number;
}
