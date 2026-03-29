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
import { User } from '../user/models/user.model';
import { Store } from 'src/store/models/store.model';
import { Role } from 'src/account/role/models/role.model';
import { UserVendorRole } from '../user-vendor-role/user-vendor-role.model';
import { Category } from 'src/category/category.model';
import { Media } from 'src/media/models/media.model';
import { Rating } from 'src/rating/models/rating.model';
import { Review } from 'src/review/model/review.model';
import { MediaType } from 'src/media/models/media-type.enum';

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'vendors',
  indexes: [
    { fields: ['business_name'], name: 'vendors_business_name_idx' },
    { fields: ['user_id'], name: 'vendors_user_id_idx' },
    { fields: ['category_id'], name: 'vendors_category_id_idx' },
    { fields: ['status'], name: 'vendors_status_idx' },
    { fields: ['is_verified'], name: 'vendors_is_verified_idx' },
  ],
})
export class Vendor extends Model<Vendor> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(255) })
  business_name: string;

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
  is_verified: boolean;

  @Column({ type: DataType.DATE })
  verified_at: Date;

  @Column({ type: DataType.STRING(255) })
  tax_id: string;

  @Column({ type: DataType.STRING(255) })
  registration_number: string;

  @Column({ type: DataType.JSONB })
  metadata: Record<string, any>;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @ForeignKey(() => Category)
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
  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Category)
  category: Category;

  @BelongsToMany(() => User, () => UserVendorRole)
  users: User[];

  @BelongsToMany(() => Role, () => UserVendorRole)
  roles: Role[];

  @HasMany(() => Store)
  stores: Store[];

  // Media associations - using scopes for polymorphic relationship
  @HasMany(() => Media, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: {
      entity_type: 'vendor',
    },
  })
  images: Media[];

  // Specific media type helpers
  @HasOne(() => Media, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: {
      entity_type: 'vendor',
      type: MediaType.VENDOR_LOGO,
      is_primary: true,
    },
  })
  logo: Media;

  @HasMany(() => Media, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: {
      entity_type: 'vendor',
      type: MediaType.VENDOR_LOGO,
    },
  })
  logos: Media[];

  @HasOne(() => Media, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: {
      entity_type: 'vendor',
      type: MediaType.VENDOR_COVER,
      is_primary: true,
    },
  })
  cover_image: Media;

  @HasMany(() => Media, {
    foreignKey: 'entity_id',
    constraints: false,
    scope: {
      entity_type: 'vendor',
      type: MediaType.VENDOR_COVER,
    },
  })
  cover_images: Media[];

  // Helper method to get primary logo
  async getPrimaryLogo(): Promise<Media | null> {
    return Media.findOne({
      where: {
        entity_type: 'vendor',
        entity_id: this.id,
        type: MediaType.VENDOR_LOGO,
        is_primary: true,
      },
    });
  }

  // Helper method to get all images
  async getAllImages(): Promise<Media[]> {
    return Media.findAll({
      where: {
        entity_type: 'vendor',
        entity_id: this.id,
      },
      order: [['sort_order', 'ASC']],
    });
  }

  // Helper method to add image
  async addImage(imageData: Partial<Media>): Promise<Media> {
    return Media.create({
      ...imageData,
      entity_type: 'vendor',
      entity_id: this.id,
    });
  }

  // Helper method to delete image
  async deleteImage(imageId: number): Promise<void> {
    await Media.destroy({
      where: {
        id: imageId,
        entity_type: 'vendor',
        entity_id: this.id,
      },
    });
  }

  // Ratings and Reviews associations (when you uncomment them)
  // @HasMany(() => Rating)
  // ratings: Rating[];

  // @HasMany(() => Review)
  // reviews: Review[];
}