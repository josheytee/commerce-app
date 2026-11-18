import {
    Table,
    Model,
    ForeignKey,
    AllowNull,
    Column,
    BelongsTo,
    Default,
    DataType,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';
import { ProductVariantModel } from './product-variant.model';
import { StoreModel } from './store.model';

@Table({
    timestamps: true,
    underscored: true,
    tableName: 'variant_stores',
    indexes: [
        {
            name: 'variant_stores_unique',
            unique: true,
            fields: ['variant_id', 'store_id'],
        },
        { fields: ['store_id'], name: 'variant_stores_store_id_idx' },
        { fields: ['variant_id'], name: 'variant_stores_variant_id_idx' },
        { fields: ['is_primary'], name: 'variant_stores_primary_idx' },
        { fields: ['stock_quantity'], name: 'variant_stores_stock_idx' },
    ],
})
export class VariantStoreModel extends Model {
    @ForeignKey(() => ProductVariantModel)
    @AllowNull(false)
    @Column
    variant_id: number;

    @ForeignKey(() => StoreModel)
    @AllowNull(false)
    @Column
    store_id: number;

    // ============ STOCK ============
    @Default(0)
    @Column({ type: DataType.INTEGER })
    quantity: number;

    @Default(0)
    @Column({ type: DataType.INTEGER })
    reserved_stock: number;

    // ============ STORE-SPECIFIC CONFIG ============
    @Default(false)
    @Column({ type: DataType.BOOLEAN })
    is_primary: boolean;

    @Column({ type: DataType.DECIMAL(10, 2) })
    price_adjustment: number;

    @Column({ type: DataType.DECIMAL(10, 2) })
    compare_at_price_adjustment: number;

    @Column({ type: DataType.DECIMAL(10, 2) })
    shipping_cost_adjustment: number;

    @Column({ type: DataType.INTEGER })
    handling_days: number;

    // ============ AVAILABILITY ============
    @Default(true)
    @Column({ type: DataType.BOOLEAN })
    is_available: boolean;

    @Column({ type: DataType.DATE })
    available_from: Date;

    @Column({ type: DataType.DATE })
    available_to: Date;

    // ============ LOW STOCK ============
    @Column({ type: DataType.INTEGER })
    low_stock_threshold: number;

    @Default(false)
    @Column({ type: DataType.BOOLEAN })
    low_stock_notified: boolean;

    // ============ METADATA ============
    @Column({ type: DataType.JSONB })
    metadata: {
        shelf_location?: string;
        aisle_number?: string;
        warehouse_zone?: string;
        bin_number?: string;
        restock_date?: Date;
        notes?: string;
    };

    // ============ RELATIONSHIPS ============
    @BelongsTo(() => ProductVariantModel)
    variant: ProductVariantModel;

    @BelongsTo(() => StoreModel)
    store: StoreModel;

    // ============ TIMESTAMPS ============
    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;

    // ============ VIRTUAL PROPERTIES ============

    get available_stock(): number {
        return this.quantity - this.reserved_stock;
    }

    get is_in_stock(): boolean {
        return this.available_stock > 0;
    }

    get is_low_stock(): boolean {
        if (!this.low_stock_threshold) return false;
        return this.available_stock <= this.low_stock_threshold;
    }

    get effective_price_adjustment(): number {
        return this.price_adjustment || 0;
    }

    // ============ METHODS ============

    reserveStock(quantity: number): boolean {
        if (this.available_stock < quantity) return false;
        this.reserved_stock += quantity;
        return true;
    }

    releaseStock(quantity: number): void {
        this.reserved_stock = Math.max(0, this.reserved_stock - quantity);
    }

    confirmStock(quantity: number): boolean {
        if (this.available_stock < quantity) return false;
        this.quantity -= quantity;
        this.reserved_stock = Math.max(0, this.reserved_stock - quantity);
        return true;
    }

    addStock(quantity: number): void {
        this.quantity += quantity;
    }

    shouldNotifyLowStock(): boolean {
        if (!this.low_stock_threshold) return false;
        return (
            this.available_stock <= this.low_stock_threshold &&
            !this.low_stock_notified
        );
    }
}
