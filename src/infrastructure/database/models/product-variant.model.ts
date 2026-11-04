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
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    AfterCreate,
    AfterUpdate,
    AfterDestroy,
} from 'sequelize-typescript';
import { ProductModel } from './product.model';
import { InventoryModel } from './inventory.model';
import { MediaModel } from './media.model';
import { DiscountModel } from './discount.model';
import { ProductVariantAttributeValueModel } from './product-variant-attribute-values.model';
import {
    MediaEntityTypeEnum,
    MediaTypeEnum,
    VariantStatusEnum,
} from 'src/shared';
import { VendorModel } from './vendor.model';
import { StoreModel } from './store.model';
import { Transaction } from 'sequelize';

@Table({
    timestamps: true,
    underscored: true,
    paranoid: true, // ✅ soft-delete matches product
    tableName: 'product_variants',
    indexes: [
        { fields: ['product_id'], name: 'variants_product_id_idx' },
        { fields: ['store_id'], name: 'variants_store_id_idx' },
        { fields: ['status'], name: 'variants_status_idx' },
        { fields: ['is_default'], name: 'variants_is_default_idx' },
        // SKU uniqueness scoped to store (multi-vendor safe)
        {
            name: 'variants_store_sku_unique',
            unique: true,
            fields: ['store_id', 'sku'],
        },
        // Barcode uniqueness scoped to store
        {
            name: 'variants_store_barcode_unique',
            unique: true,
            fields: ['store_id', 'barcode'],
            where: { barcode: { [Symbol.for('ne')]: null } } as any,
        },
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

    @AllowNull(false)
    @Column
    vendor_id: number;

    // Denormalized store_id for fast store-scoped queries
    @AllowNull(false)
    @Column
    store_id: number;

    // ============ IDENTIFIERS ============
    @AllowNull(false)
    @Column({ type: DataType.STRING(100) })
    sku: string;

    @Column({ type: DataType.STRING(100) })
    barcode: string;

    @Column({ type: DataType.STRING(100) })
    mpn: string;

    // ============ DISPLAY ============
    @Column({ type: DataType.STRING(255) })
    variant_name: string; // "Red / Size 42" (auto-generated or custom)

    // Marks the "default" variant used when a SIMPLE product is purchased.
    // Every simple product has exactly one variant with is_default = true.
    @Default(false)
    @Column({ type: DataType.BOOLEAN })
    is_default: boolean;

    @Column({ type: DataType.INTEGER })
    position: number; // display order

    // ============ PRICING (source of truth) ============
    @AllowNull(false)
    @Column({ type: DataType.DECIMAL(12, 2) })
    price: number;

    @Column({ type: DataType.DECIMAL(12, 2) })
    compare_at_price: number;

    @Column({ type: DataType.DECIMAL(12, 2) })
    cost_price: number;

    // ============ SHIPPING ============
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

    // ============ STATUS ============
    @Default(VariantStatusEnum.ACTIVE)
    @Column({ type: DataType.ENUM(...Object.values(VariantStatusEnum)) })
    status: VariantStatusEnum;

    // ============ FLEXIBLE METADATA ============
    @Column({ type: DataType.JSONB })
    metadata: Record<string, any>;

    // ============ RELATIONS ============
    @BelongsTo(() => ProductModel, {
        foreignKey: 'product_id',
        as: 'product',
    })
    product: ProductModel;

    @BelongsTo(() => VendorModel, {
        foreignKey: 'vendor_id',
        as: 'vendor',
    })
    vendor: VendorModel;

    @BelongsTo(() => StoreModel, {
        foreignKey: 'store_id',
        as: 'store',
    })
    store: StoreModel;

    // Stock lives HERE and only here
    @HasMany(() => InventoryModel, {
        foreignKey: 'variant_id',
        as: 'inventories',
    })
    inventories: InventoryModel[];

    @HasMany(() => ProductVariantAttributeValueModel, {
        foreignKey: 'variant_id',
        as: 'attribute_values',
    })
    attribute_values: ProductVariantAttributeValueModel[];

    @HasMany(() => MediaModel, {
        foreignKey: 'entity_id',
        constraints: false,
        scope: {
            entity_type: MediaEntityTypeEnum.PRODUCT_VARIANT,
            type: MediaTypeEnum.VARIANT_IMAGE,
        },
    })
    gallery: MediaModel[];

    @HasMany(() => DiscountModel, {
        foreignKey: 'entity_id',
        constraints: false,
        scope: { entity_type: MediaEntityTypeEnum.PRODUCT_VARIANT },
    })
    discounts: DiscountModel[];

    // ============ TIMESTAMPS ============
    @CreatedAt
    @Column
    created_at: Date;

    @UpdatedAt
    @Column
    updated_at: Date;

    @DeletedAt
    @Column
    deleted_at: Date;

    // ============ VIRTUAL FIELDS ============

    get discount_percentage(): number {
        if (
            this.compare_at_price &&
            Number(this.compare_at_price) > Number(this.price)
        ) {
            return (
                ((Number(this.compare_at_price) - Number(this.price)) /
                    Number(this.compare_at_price)) *
                100
            );
        }
        return 0;
    }

    // Sum across all inventory locations
    get total_stock(): number {
        return (
            this.inventories?.reduce(
                (sum, inv) => sum + Number(inv.quantity ?? 0),
                0,
            ) ?? 0
        );
    }

    get available_stock(): number {
        return (
            this.inventories?.reduce(
                (sum, inv) =>
                    sum + (Number(inv.quantity ?? 0) - Number(inv.reserved_quantity ?? 0)),
                0,
            ) ?? 0
        );
    }

    get is_in_stock(): boolean {
        return this.available_stock > 0;
    }

    @AfterCreate
    @AfterUpdate
    @AfterDestroy
    static async refreshProductPriceRange(
        instance: ProductVariantModel,
        options: { transaction?: Transaction },
    ) {
        const productId = instance.product_id;
        if (!productId) return;

        const prices = await ProductVariantModel.findAll({
            where: { product_id: productId },
            attributes: ['price'],
            transaction: options.transaction,
        });

        if (!prices.length) return;
        const nums = prices
            .map((v) => Number(v.price))
            .filter((n) => !Number.isNaN(n));
        if (!nums.length) return;

        await ProductModel.update(
            {
                min_variant_price: Math.min(...nums),
                max_variant_price: Math.max(...nums),
            },
            { where: { id: productId }, transaction: options.transaction },
        );
    }
}
