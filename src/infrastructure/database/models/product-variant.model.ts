import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
    BelongsTo,
    DataType,
    Default,
    AllowNull,
    Unique,
    HasMany,
} from 'sequelize-typescript';
import { ProductModel } from './product.model';
import { InventoryModel } from './inventory.model';
import { MediaModel } from './media.model';
import { DiscountModel } from './discount.model';
import { VariantStockStatusEnum } from 'src/shared';

@Table({
    timestamps: true,
    underscored: true,
    tableName: 'product_variants',
    indexes: [
        { fields: ['product_id'], name: 'variants_product_id_idx' },
        { fields: ['sku'], name: 'variants_sku_idx', unique: true },
    ],
})
export class ProductVariantModel extends Model<ProductVariantModel> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => ProductModel)
    @AllowNull(false)
    @Column
    product_id: number;

    @Unique
    @Column({ type: DataType.STRING(100) })
    sku: string;

    @Column({ type: DataType.STRING(100) })
    barcode: string;

    @Column({ type: DataType.JSONB })
    attributes: Record<string, any>; // { color: 'red', size: 'XL' }

    @AllowNull(false)
    @Column({ type: DataType.DECIMAL(10, 2) })
    price: number;

    @Column({ type: DataType.DECIMAL(10, 2) })
    compare_at_price: number;

    @Column({ type: DataType.DECIMAL(10, 2) })
    cost_price: number;

    @Column({ type: DataType.STRING(500) })
    image_url: string;

    // Shipping
    @Column({ type: DataType.DECIMAL(10, 2) })
    weight: number;

    @Column({ type: DataType.DECIMAL(10, 2) })
    length: number;

    @Column({ type: DataType.DECIMAL(10, 2) })
    width: number;

    @Column({ type: DataType.DECIMAL(10, 2) })
    height: number;

    @Default(true)
    @Column({ type: DataType.BOOLEAN })
    requires_shipping: boolean;

    @Column({ type: DataType.STRING(100) })
    shipping_class: string;

    @Column({ type: DataType.JSONB })
    metadata: Record<string, any>;

    @BelongsTo(() => ProductModel)
    product: ProductModel;

    @HasMany(() => InventoryModel)
    inventories: InventoryModel[];

    @HasMany(() => MediaModel, {
        foreignKey: 'entity_id',
        constraints: false,
        scope: {
            entity_type: 'product_variant',
        },
    })
    images: MediaModel[];

    @HasMany(() => DiscountModel, {
        foreignKey: 'entity_id',
        constraints: false,
        scope: {
            entity_type: 'product_variant',
        },
    })
    discounts: DiscountModel[];


    get discount_percentage(): number {
        if (this.compare_at_price && this.compare_at_price > this.price) {
            return (
                ((this.compare_at_price - this.price) / this.compare_at_price) * 100
            );
        }
        return 0;
    }
}
