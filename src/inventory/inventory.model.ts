import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Product } from 'src/product/product.model';
import { Store } from 'src/store/models/store.model';

@Table({ tableName: 'inventories' })
export class Inventory extends Model<Inventory> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Store)
  @Column
  store_id: number;

  @BelongsTo(() => Store)
  store: Store;

  @ForeignKey(() => Product)
  @Column
  product_id: number;

  @BelongsTo(() => Product)
  product: Product;

  @Column
  quantity: number;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
