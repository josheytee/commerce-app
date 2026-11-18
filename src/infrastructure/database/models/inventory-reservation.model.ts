import {
  Table,
  PrimaryKey,
  AutoIncrement,
  Column,
  ForeignKey,
  AllowNull,
  DataType,
  Default,
  CreatedAt,
  UpdatedAt,
  Model,
  BelongsTo,
} from 'sequelize-typescript';
import { InventoryReservationStatusEnum } from 'src/shared';
import { ProductVariantModel } from './product-variant.model';
import { StoreModel } from './store.model';
import { CartItemModel } from './cart-item.model';
import { InventoryModel } from './inventory.model';

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'inventory_reservations',
  indexes: [
    { fields: ['variant_id', 'store_id'], name: 'ir_variant_store_idx' },
    { fields: ['status'], name: 'ir_status_idx' },
    { fields: ['expires_at'], name: 'ir_expires_at_idx' },
  ],
})
export class InventoryReservationModel extends Model<InventoryReservationModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => ProductVariantModel)
  @AllowNull(false)
  @Column
  variant_id: number;

  @BelongsTo(() => ProductVariantModel)
  variant: ProductVariantModel;

  @ForeignKey(() => InventoryModel)
  @AllowNull(false)
  @Column
  inventory_id: number;

  @BelongsTo(() => InventoryModel)
  inventory: InventoryModel;

  // @ForeignKey(() => StoreModel)
  // @AllowNull(false)
  // @Column
  // store_id: number;

  // @BelongsTo(() => StoreModel)
  // store: StoreModel;

  @ForeignKey(() => CartItemModel)
  @Column
  cart_item_id: number;

  @BelongsTo(() => CartItemModel)
  cart_item: CartItemModel;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  quantity: number;

  @Default(InventoryReservationStatusEnum.HELD)
  @Column({
    type: DataType.ENUM(...Object.values(InventoryReservationStatusEnum)),
  })
  status: InventoryReservationStatusEnum;

  @Column({ type: DataType.DATE })
  expires_at: Date;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;
}
