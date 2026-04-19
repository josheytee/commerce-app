import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
  HasMany,
  BelongsToMany,
  DataType,
  Default,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasOne,
} from 'sequelize-typescript';
import { CategoryModel } from './category.model';
import { UserModel } from './user.model';
import { UserVendorRoleModel } from './user-vendor-role.model';
import { RoleModel } from './role.model';
import { StoreModel } from './store.model';
import { MediaModel } from './media.model';
import { MediaTypeEnum } from 'src/shared';

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'vendors',
  indexes: [
    { fields: ['business_name'], name: 'vendors_business_name_idx' },
    { fields: ['user_id'], name: 'vendors_user_id_idx' },
    { fields: ['category_id'], name: 'vendors_category_id_idx' },
    { fields: ['status'], name: 'vendors_status_idx' },
    { fields: ['slug'], name: 'vendors_slug_idx' },
    { fields: ['is_verified'], name: 'vendors_is_verified_idx' },
  ],
})
export class VendorModel extends Model<VendorModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(255) })
  business_name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(255) })
  slug: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(20) })
  business_phone: string;

  @Column({ type: DataType.STRING(100) })
  business_email: string;

  @Column({ type: DataType.STRING(100) })
  business_type: string;

  @Column({ type: DataType.TEXT })
  business_description: string;

  @Column({ type: DataType.TEXT })
  business_short_description: string;

  @Column({ type: DataType.STRING(255) })
  document_type: string;

  @Column({ type: DataType.STRING(255) })
  document_url: string;

  @Default(0)
  @Column({ type: DataType.DECIMAL(3, 2) })
  rating_average: number;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  total_ratings: number;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  total_reviews: number;

  @Column({ type: DataType.JSONB })
  social_media: Record<string, any>;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  delivery_options: string[];

  @Default('pending')
  @Column({ type: DataType.ENUM('pending', 'active', 'suspended', 'inactive') })
  status: string;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  is_default: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  is_verified: boolean;

  @Column({ type: DataType.DATE })
  verified_at: Date;

  @Column({ type: DataType.STRING(255) })
  tax_id: string;

  @Column({ type: DataType.STRING(255) })
  registration_number: string;

  @Column({ type: DataType.JSONB })
  metadata: Record<string, any>;

  @ForeignKey(() => UserModel)
  @Column
  user_id: number;

  @ForeignKey(() => CategoryModel)
  @Column
  category_id: number;

  @CreatedAt
  @Column
  created_at: Date;

  @UpdatedAt
  @Column
  updated_at: Date;

  @DeletedAt
  @Column
  deleted_at: Date;

  // Associations
  @BelongsTo(() => UserModel)
  user: UserModel;

  @BelongsTo(() => CategoryModel)
  category: CategoryModel;

  @BelongsToMany(() => UserModel, () => UserVendorRoleModel)
  users: UserModel[];

  @BelongsToMany(() => RoleModel, () => UserVendorRoleModel)
  roles: RoleModel[];

  @HasMany(() => StoreModel)
  stores: StoreModel[];

  // MediaModel associations - using scopes for polymorphic relationship
  @HasMany(() => MediaModel, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: {
      entity_type: 'vendor',
    },
  })
  images: MediaModel[];

  // Specific media type helpers
  @HasOne(() => MediaModel, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: {
      entity_type: 'vendor',
      type: MediaTypeEnum.VENDOR_LOGO,
      is_primary: true,
    },
  })
  logo: MediaModel;

  @HasMany(() => MediaModel, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: {
      entity_type: 'vendor',
      type: MediaTypeEnum.VENDOR_LOGO,
    },
  })
  logos: MediaModel[];

  @HasOne(() => MediaModel, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: {
      entity_type: 'vendor',
      type: MediaTypeEnum.VENDOR_COVER,
      is_primary: true,
    },
  })
  cover_image: MediaModel;

  @HasMany(() => MediaModel, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: {
      entity_type: 'vendor',
      type: MediaTypeEnum.VENDOR_COVER,
    },
  })
  cover_images: MediaModel[];

  // Helper method to get primary logo
  async getPrimaryLogo(): Promise<MediaModel | null> {
    return MediaModel.findOne({
      where: {
        entity_type: 'vendor',
        entity_id: this.id,
        type: MediaTypeEnum.VENDOR_LOGO,
        is_primary: true,
      },
    });
  }

  // Helper method to get all images
  async getAllImages(): Promise<MediaModel[]> {
    return MediaModel.findAll({
      where: {
        entity_type: 'vendor',
        entity_id: this.id,
      },
      order: [['sort_order', 'ASC']],
    });
  }

  // Helper method to add image
  async addImage(imageData: Partial<MediaModel>): Promise<MediaModel> {
    return MediaModel.create({
      ...imageData,
      entity_type: 'vendor',
      entity_id: this.id,
    });
  }

  // Helper method to delete image
  async deleteImage(imageId: number): Promise<void> {
    await MediaModel.destroy({
      where: {
        id: imageId,
        entity_type: 'vendor',
        entity_id: this.id,
      },
    });
  }

  // Ratings and Reviews associations (when you uncomment them)
  // @HasMany(() => RatingModel)
  // ratings: RatingModel[];

  // @HasMany(() => ReviewModel)
  // reviews: ReviewModel[];
}
