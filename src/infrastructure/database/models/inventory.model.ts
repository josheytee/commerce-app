import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
  Default,
  AllowNull,
  DataType,
  BeforeSave,
} from 'sequelize-typescript';
import { StoreModel } from './store.model';
import { ProductVariantModel } from './product-variant.model';
import { StockStatusEnum } from 'src/shared';

// NOTE: store_id is the fulfillment location for now.
// When multi-warehouse / 3PL / dropship support is added,
// introduce LocationModel and migrate store_id → location_id.

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'inventories',
  indexes: [
    {
      fields: ['variant_id'],
      unique: true,
      name: 'inv_variant_store_uidx',
    },
    { fields: ['stock_status'], name: 'inv_store_status_idx' },
  ],
})
export class InventoryModel extends Model<InventoryModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => ProductVariantModel)
  @AllowNull(false)
  @Column
  variant_id: number;

  @BelongsTo(() => ProductVariantModel, {
    foreignKey: 'variant_id',
    as: 'variant',
  })
  variant: ProductVariantModel;

  // ============ STOCK LEVELS ============
  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  stock_quantity: number;

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  reserved_quantity: number;

  // Generated at the DB layer (migration):
  //   GENERATED ALWAYS AS (quantity - reserved_quantity) STORED
  // Declared with `declare` so Sequelize never writes it.
  declare available_quantity: number;

  // ============ STATUS & FLAGS ============
  @Default(StockStatusEnum.IN_STOCK)
  @Column({ type: DataType.ENUM(...Object.values(StockStatusEnum)) })
  stock_status: StockStatusEnum;

  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  track_quantity: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  allow_backorders: boolean;

  // ============ ALERTS ============
  @Default(5)
  @Column({ type: DataType.INTEGER })
  low_stock_threshold: number;

  // ============ HOOKS ============
  @BeforeSave
  static syncStockStatus(instance: InventoryModel) {
    if (!instance.track_quantity) {
      instance.stock_status = StockStatusEnum.IN_STOCK;
      return;
    }

    const available =
      Number(instance.stock_quantity) - Number(instance.reserved_quantity);

    if (available > instance.low_stock_threshold) {
      instance.stock_status = StockStatusEnum.IN_STOCK;
    } else if (available > 0) {
      instance.stock_status = StockStatusEnum.LOW_STOCK;
    } else if (instance.allow_backorders) {
      instance.stock_status = StockStatusEnum.ON_BACKORDER;
    } else {
      instance.stock_status = StockStatusEnum.OUT_OF_STOCK;
    }
  }
}
