// ============================================================
// DIGITAL DELIVERY
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
    BelongsTo,
    Model,
} from 'sequelize-typescript';
import { OrderItemModel } from './order-item.model';
import { ProductVariantModel } from './product-variant.model';

// ============================================================
@Table({
    timestamps: true,
    underscored: true,
    tableName: 'digital_deliveries',
    indexes: [
        { fields: ['variant_id'], name: 'dd_variant_idx' },
        { fields: ['order_item_id'], name: 'dd_order_item_idx' },
    ],
})
export class DigitalDeliveryModel extends Model<DigitalDeliveryModel> {
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

    @ForeignKey(() => OrderItemModel)
    @AllowNull(false)
    @Column
    order_item_id: number;

    @BelongsTo(() => OrderItemModel)
    order_item: OrderItemModel;

    @Column({ type: DataType.TEXT })
    file_url: string;

    @Column({ type: DataType.STRING(255) })
    file_name: string;

    @Column({ type: DataType.STRING(100) })
    license_key: string;

    @Default(0)
    @Column({ type: DataType.INTEGER })
    download_count: number;

    @Default(3)
    @Column({ type: DataType.INTEGER })
    max_downloads: number;

    @Column({ type: DataType.DATE })
    expires_at: Date;

    @Column({ type: DataType.DATE })
    last_downloaded_at: Date;

    @CreatedAt
    @Column({ field: 'created_at' })
    created_at: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updated_at: Date;
}
