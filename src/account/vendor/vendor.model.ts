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
} from 'sequelize-typescript';
import { User } from '../user/models/user.model';
import { Store } from 'src/store/models/store.model';
import { Role } from 'src/account/role/models/role.model';
import { UserVendorRole } from '../user-vendor-role/user-vendor-role.model';
import { Category } from 'src/category/category.model';
// import { VendorImage } from './vendor-image.model';
// import { VendorRating } from './vendor-rating.model';
// import { VendorReview } from './vendor-review.model';

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'vendors',
  indexes: [
    {
      fields: ['business_name'],
      name: 'vendors_business_name_idx',
    },
    {
      fields: ['user_id'],
      name: 'vendors_user_id_idx',
    },
    {
      fields: ['category_id'],
      name: 'vendors_category_id_idx',
    },
    {
      fields: ['status'],
      name: 'vendors_status_idx',
    },
    {
      fields: ['is_verified'],
      name: 'vendors_is_verified_idx',
    },
  ],
})
export class Vendor extends Model<Vendor> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
  })
  business_name: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
  })
  business_phone: string;

  @Column({
    type: DataType.STRING(100),
  })
  business_email: string;

  @Column({
    type: DataType.TEXT,
  })
  business_description: string;

  @Column({
    type: DataType.TEXT,
  })
  business_short_description: string;

  @Column({
    type: DataType.STRING(500),
  })
  business_address: string;

  @Column({
    type: DataType.STRING(255),
  })
  business_website: string;

  @Column({
    type: DataType.STRING(255),
  })
  logo_url: string;

  @Column({
    type: DataType.STRING(255),
  })
  cover_image_url: string;

  @Default(0)
  @Column({
    type: DataType.DECIMAL(3, 2),
  })
  rating_average: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  total_ratings: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  total_reviews: number;

  @Column({
    type: DataType.JSONB,
  })
  business_hours: Record<string, any>;

  @Column({
    type: DataType.JSONB,
  })
  social_media: Record<string, any>;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  business_services: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  payment_methods: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  delivery_options: string[];

  @Default('pending')
  @Column({
    type: DataType.ENUM('pending', 'active', 'suspended', 'inactive'),
  })
  status: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  is_verified: boolean;

  @Column({
    type: DataType.DATE,
  })
  verified_at: Date;

  @Column({
    type: DataType.STRING(255),
  })
  tax_id: string;

  @Column({
    type: DataType.STRING(255),
  })
  registration_number: string;

  @Column({
    type: DataType.JSONB,
  })
  settings: Record<string, any>;

  @Column({
    type: DataType.JSONB,
  })
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

  // @HasMany(() => VendorImage)
  // images: VendorImage[];

  // @HasMany(() => VendorRating)
  // ratings: VendorRating[];

  // @HasMany(() => VendorReview)
  // reviews: VendorReview[];
}
