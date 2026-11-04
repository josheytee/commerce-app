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
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BelongsToMany,
} from 'sequelize-typescript';
import { SectionModel } from './section.model';
import { StoreModel } from './store.model';
import { ProductVariantModel } from './product-variant.model';
import { MediaModel } from './media.model';
import { VendorModel } from './vendor.model';
import { ReviewModel } from './review.model';
import { DiscountModel } from './discount.model';
import { TagModel } from './tag.model';
import { ProductAttributeValueModel } from './product-attribute-values.model';
import { SearchDocumentModel } from './search_documents.model';
import {
  MediaEntityTypeEnum,
  MediaTypeEnum,
  ProductStatusEnum,
  ProductTypeEnum,
} from 'src/shared';

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
    { fields: ['vendor_id'], name: 'products_vendor_id_idx' },
    { fields: ['status'], name: 'products_status_idx' },
    { fields: ['product_type'], name: 'products_type_idx' },
    { fields: ['created_at'], name: 'products_created_at_idx' },
    { fields: ['updated_at'], name: 'products_updated_at_idx' },
    { fields: ['is_featured'], name: 'products_featured_idx' },
    { fields: ['is_active'], name: 'products_active_idx' },
    { fields: ['min_variant_price'], name: 'products_min_price_idx' },
    { fields: ['max_variant_price'], name: 'products_max_price_idx' },
    { fields: ['published_at'], name: 'products_published_at_idx' },
  ],
})
export class ProductModel extends Model<ProductModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  // ============ BASIC INFORMATION ============
  @AllowNull(false)
  @Column({ type: DataType.STRING(255) })
  name: string;

  // Scoped uniqueness enforced via composite index (store_id + slug)
  @AllowNull(false)
  @Column({ type: DataType.STRING(255) })
  slug: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.TEXT })
  short_description: string;

  @Column({ type: DataType.TEXT })
  specification: string;

  // ============ PRICING (display defaults; variants are source of truth) ============
  // Denormalized range of variant prices — updated via hooks on ProductVariant
  @Default(0)
  @Column({ type: DataType.DECIMAL(12, 2) })
  min_variant_price: number;

  @Default(0)
  @Column({ type: DataType.DECIMAL(12, 2) })
  max_variant_price: number;

  // Currency for this product (multi-currency support)
  @Default('USD')
  @AllowNull(false)
  @Column({ type: DataType.STRING(3) })
  currency: string;

  // Tax
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  is_taxable: boolean;

  @Column({ type: DataType.STRING(100) })
  tax_class: string;

  // ============ SEO & METADATA ============
  @Column({ type: DataType.STRING(160) })
  meta_title: string;

  @Column({ type: DataType.TEXT })
  meta_description: string;

  @Column({ type: DataType.STRING(255) })
  meta_keywords: string;

  // ============ STATUS & FLAGS ============
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
  allow_backorders: boolean;

  // ============ DENORMALIZED METRICS (updated via events/hooks) ============
  @Default(0)
  @Column({ type: DataType.INTEGER })
  total_ratings: number;

  @Default(0)
  @Column({ type: DataType.DECIMAL(3, 2) })
  average_rating: number;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  sales_count: number;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  views: number;

  // ============ AVAILABILITY WINDOW ============
  @Column({ type: DataType.DATE })
  published_at: Date;

  @Column({ type: DataType.DATE })
  available_from: Date;

  @Column({ type: DataType.DATE })
  available_to: Date;

  // ============ RELATIONS ============
  @ForeignKey(() => SectionModel)
  @Column
  section_id: number;

  @ForeignKey(() => StoreModel)
  @AllowNull(false)
  @Column
  store_id: number;

  @ForeignKey(() => VendorModel)
  @AllowNull(false)
  @Column
  vendor_id: number;

  @BelongsTo(() => SectionModel)
  section: SectionModel;

  @BelongsTo(() => StoreModel)
  store: StoreModel;

  @BelongsTo(() => VendorModel)
  vendor: VendorModel;

  // ============ CHILD ASSOCIATIONS ============

  // Every product has at least one variant (simple = single default variant)
  @HasMany(() => ProductVariantModel, {
    foreignKey: 'product_id',
    as: 'variants',
  })
  variants: ProductVariantModel[];

  // Product-level attribute values (used for SIMPLE products or shared attrs)
  @HasMany(() => ProductAttributeValueModel, {
    foreignKey: 'product_id',
    as: 'attribute_values',
  })
  attribute_values: ProductAttributeValueModel[];

  // Unified media association — use scopes to filter
  @HasMany(() => MediaModel, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: {
      entity_type: MediaEntityTypeEnum.PRODUCT,
    },
  })
  gallery_images: MediaModel[];

  @HasOne(() => MediaModel, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: {
      entity_type: MediaEntityTypeEnum.PRODUCT,
      is_primary: true,
    },
  })
  featured_image: MediaModel;

  // Reviews (polymorphic)
  @HasMany(() => ReviewModel, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: { entity_type: MediaEntityTypeEnum.PRODUCT },
  })
  reviews: ReviewModel[];

  // Tags (polymorphic)
  @HasMany(() => TagModel, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: { entity_type: MediaEntityTypeEnum.PRODUCT },
  })
  tags: TagModel[];

  // Discounts (polymorphic)
  @HasMany(() => DiscountModel, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: { entity_type: MediaEntityTypeEnum.PRODUCT },
  })
  discounts: DiscountModel[];

  // Search index (one-to-one)
  @HasOne(() => SearchDocumentModel, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: { entity_type: MediaEntityTypeEnum.PRODUCT },
  })
  search_document: SearchDocumentModel;

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

  get is_configurable(): boolean {
    return this.product_type === ProductTypeEnum.VARIABLE;
  }

  get is_simple(): boolean {
    return this.product_type === ProductTypeEnum.SIMPLE;
  }

  get has_price_range(): boolean {
    return (
      this.is_configurable &&
      Number(this.min_variant_price) !== Number(this.max_variant_price)
    );
  }

  get formatted_price_range(): string {
    const fmt = (v: number) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: this.currency || 'USD',
      }).format(v);

    if (this.has_price_range) {
      return `${fmt(this.min_variant_price)} – ${fmt(this.max_variant_price)}`;
    }
    return fmt(this.min_variant_price);
  }
}
