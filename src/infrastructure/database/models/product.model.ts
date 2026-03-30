// infrastructure/database/models/product.model.ts
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
    BelongsTo,
    HasMany,
    HasOne,
    BelongsToMany,
    Scopes,
    Default,
    AllowNull,
    Unique,
    Index,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
} from 'sequelize-typescript';
import { StoreModel } from './store.model';
import { VendorModel } from './vendor.model';
import { SectionModel } from './section.model';
import { ProductVariantModel } from './product-variant.model';
import { InventoryModel } from './inventory.model';

@Scopes(() => ({
    active: {
        where: { isActive: true },
    },
    withInventory: {
        include: [InventoryModel],
    },
    withVariants: {
        include: [ProductVariantModel],
    },
}))
@Table({
    tableName: 'products',
    timestamps: true,
    paranoid: true, // Soft deletes
    underscored: true, // Use snake_case in DB
    indexes: [
        { name: 'idx_products_name', fields: ['name'] },
        { name: 'idx_products_slug', fields: ['slug'], unique: true },
        { name: 'idx_products_store_id', fields: ['store_id'] },
        { name: 'idx_products_price', fields: ['price'] },
        {
            name: 'idx_products_status_created',
            fields: ['is_active', 'created_at'],
        },
    ],
})
export class ProductModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @AllowNull(false)
    @Column(DataType.STRING(255))
    name: string;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING(255))
    slug: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    details: string;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.DECIMAL(10, 2))
    price: number;

    @AllowNull(false)
    @Default(true)
    @Column(DataType.BOOLEAN)
    isActive: boolean;

    // Foreign Keys
    @ForeignKey(() => StoreModel)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    storeId: number;

    @ForeignKey(() => VendorModel)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    vendorId: number;

    @ForeignKey(() => SectionModel)
    @AllowNull(true)
    @Column(DataType.INTEGER)
    sectionId: number;

    // Timestamps
    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;

    // Associations
    @BelongsTo(() => StoreModel)
    store: StoreModel;

    @BelongsTo(() => VendorModel)
    vendor: VendorModel;

    @BelongsTo(() => SectionModel)
    section: SectionModel;

    @HasMany(() => ProductVariantModel)
    variants: ProductVariantModel[];

    @HasOne(() => InventoryModel)
    inventory: InventoryModel;
}
