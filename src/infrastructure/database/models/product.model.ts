import {
  Table,
  Column,
  Model,
  HasMany,
  HasOne,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
  DataType,
  Default,
  AllowNull,
  Unique,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Index,
  BelongsToMany,
} from 'sequelize-typescript';
import { SectionModel } from './section.model';
import { StoreModel } from './store.model';
import { InventoryModel } from './inventory.model';
import { ProductAttributeModel } from './product-attribute.model';
import { ProductVariantModel } from './product-variant.model';
import { MediaModel } from './media.model';
import { VendorModel } from './vendor.model';
import { ReviewModel } from './review.model';
import { DiscountModel } from './discount.model';
import { TagModel } from './tag.model';
import { MediaTypeEnum, ProductStatusEnum, ProductTypeEnum } from 'src/shared';

@Table({
  timestamps: true,
  underscored: true,
  paranoid: true,
  tableName: 'products',
  indexes: [
    {
      name: 'products_store_slug_unique',
      unique: true,
      fields: ['store_id', 'slug'],
    },
    { fields: ['store_id'], name: 'products_store_id_idx' },
    { fields: ['section_id'], name: 'products_section_id_idx' },
    { fields: ['status'], name: 'products_status_idx' },
    { fields: ['price'], name: 'products_price_idx' },
    { fields: ['created_at'], name: 'products_created_at_idx' },
    { fields: ['updated_at'], name: 'products_updated_at_idx' },
    {
      name: 'products_vendor_sku_unique',
      unique: true,
      fields: ['vendor_id', 'sku'],
    },
    { fields: ['vendor_id'], name: 'products_vendor_id_idx' },
    { fields: ['is_featured'], name: 'products_featured_idx' },
    { fields: ['is_active'], name: 'products_active_idx' },
    { fields: ['stock_quantity'], name: 'products_stock_idx' },
    {
      fields: ['weight', 'length', 'width', 'height'],
      name: 'products_shipping_idx',
    },
  ],
})
export class ProductModel extends Model<ProductModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  // Basic Information
  @AllowNull(false)
  @Column({ type: DataType.STRING(255) })
  name: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING(255) })
  slug: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.TEXT })
  short_description: string;

  @Column({ type: DataType.TEXT })
  specification: string;

  // SKU & Identifiers

  @Index({ unique: true })
  @Column({ type: DataType.STRING(100), allowNull: true })
  upc: string;

  @Index({ unique: true })
  @Column({ type: DataType.STRING(100), allowNull: true })
  ean: string;

  @Index({ unique: true })
  @Column({ type: DataType.STRING(100), allowNull: true })
  isbn: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  mpn: string;

  // Pricing
  @AllowNull(false)
  @Column({ type: DataType.DECIMAL(10, 2) })
  price: number;

  @Column({ type: DataType.DECIMAL(10, 2) })
  compare_at_price: number;

  @Column({ type: DataType.DECIMAL(10, 2) })
  cost_price: number;

  // SEO & Metadata
  @Column({ type: DataType.STRING(160) })
  meta_title: string;

  @Column({ type: DataType.TEXT })
  meta_description: string;

  @Column({ type: DataType.STRING(255) })
  meta_keywords: string;

  // Status & Flags
  @Default(ProductStatusEnum.DRAFT)
  @Column({ type: DataType.ENUM(...Object.values(ProductStatusEnum)) })
  status: ProductStatusEnum;

  @Default(ProductTypeEnum.SIMPLE)
  @Column({ type: DataType.ENUM(...Object.values(ProductTypeEnum)) })
  product_type: ProductTypeEnum;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  is_featured: boolean;

  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  is_active: boolean;

  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  review_able: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  is_taxable: boolean;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  total_ratings: number;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  sales_count: number;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  views: number;

  // Dates
  @Column({ type: DataType.DATE })
  published_at: Date;

  @Column({ type: DataType.DATE })
  available_from: Date;

  @Column({ type: DataType.DATE })
  available_to: Date;

  // Relations
  @ForeignKey(() => SectionModel)
  @Column
  section_id: number;

  @ForeignKey(() => StoreModel)
  @Column
  store_id: number;

  @ForeignKey(() => VendorModel)
  @Column
  vendor_id: number;

  @BelongsTo(() => SectionModel)
  section: SectionModel;

  @BelongsTo(() => StoreModel)
  store: StoreModel;

  @BelongsTo(() => VendorModel)
  vendor: VendorModel;

  // Child associations
  @HasMany(() => InventoryModel)
  inventories: InventoryModel[];

  @HasMany(() => ProductAttributeModel)
  attributes: ProductAttributeModel[];

  // Media association (polymorphic)
  @HasMany(() => MediaModel, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: {
      entity_type: 'product',
    },
  })
  gallery_images: MediaModel[];

  // Media
  @HasMany(() => MediaModel, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: {
      entity_type: 'product',
      type: MediaTypeEnum.PRODUCT_IMAGE,
      is_primary: true,
    },
  })
  featured_image: string;

  // Variants association
  @HasMany(() => ProductVariantModel)
  variants: ProductVariantModel[];

  // Reviews association
  @HasMany(() => ReviewModel, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: {
      entity_type: 'product',
    },
  })
  reviews: ReviewModel[];

  // Tags association (many-to-many)
  @HasMany(() => TagModel, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: {
      entity_type: 'product',
    },
  })
  tags: TagModel[];

  // Discounts association (polymorphic)
  @HasMany(() => DiscountModel, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: {
      entity_type: 'product',
    },
  })
  discounts: DiscountModel[];

  // Timestamps
  @CreatedAt
  @Column
  created_at: Date;

  @UpdatedAt
  @Column
  updated_at: Date;

  @DeletedAt
  @Column
  deleted_at: Date;

  // Virtual fields / computed properties

  get has_variants(): boolean {
    return this.product_type === ProductTypeEnum.VARIABLE;
  }

  get formatted_price(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(this.price);
  }
}
