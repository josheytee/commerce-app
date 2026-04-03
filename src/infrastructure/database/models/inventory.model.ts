import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
  Default,
  DataType,
} from 'sequelize-typescript';
import { StoreModel } from 'src/infrastructure/database/models/store.model';
import { ProductModel } from 'src/infrastructure/database/models/product.model';
import { StockStatusEnum } from 'src/shared';
import { ProductVariantModel } from './product-variant.model';

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

  @ForeignKey(() => ProductVariantModel)
  @Column
  product_variant_id: number;

  @BelongsTo(() => ProductModel)
  product: ProductModel;

  @BelongsTo(() => ProductVariantModel)
  product_variant: ProductVariantModel;

  @Column
  quantity: number;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  stock_quantity: number;

  @Default(StockStatusEnum.IN_STOCK)
  @Column({ type: DataType.ENUM(...Object.values(StockStatusEnum)) })
  stock_status: StockStatusEnum;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  low_stock_threshold: number;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  reserved_quantity: number;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  track_quantity: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  allow_backorders: boolean;

}
