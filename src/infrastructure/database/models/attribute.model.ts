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
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { AttributeValueModel } from './attribute-value.model';
import { VendorModel } from './vendor.model';
import { AttributeTypeEnum } from 'src/shared';

@Table({
  tableName: 'attributes',
  timestamps: true,
  underscored: true,
  paranoid: true, // soft-delete: preserves variant→attribute links
  indexes: [
    // Vendor-scoped uniqueness (also covers platform rows when vendor_id is set)
    {
      name: 'attributes_vendor_code_uidx',
      unique: true,
      fields: ['vendor_id', 'code'],
    },
    // Platform-scoped uniqueness — Postgres partial index
    // (NULL vendor_id would otherwise bypass the composite unique above)
    {
      name: 'attributes_platform_code_uidx',
      unique: true,
      fields: ['code'],
      where: { vendor_id: null },
    },
    // Fast lookup: "all platform attributes" or "all attributes for vendor X"
    { fields: ['vendor_id'], name: 'attributes_vendor_id_idx' },
    // UI filtering
    { fields: ['is_filterable'], name: 'attributes_filterable_idx' },
    { fields: ['is_variant_attribute'], name: 'attributes_variant_attr_idx' },
  ],
})
export class AttributeModel extends Model<AttributeModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  // ============ OWNERSHIP ============
  // NULL = platform attribute (admin-managed, global)
  // set  = vendor-owned attribute
  @ForeignKey(() => VendorModel)
  @AllowNull(true)
  @Column
  vendor_id: number | null;

  @BelongsTo(() => VendorModel, {
    foreignKey: 'vendor_id',
    as: 'vendor',
  })
  vendor: VendorModel;

  // ============ IDENTITY ============
  @AllowNull(false)
  @Column({ type: DataType.STRING(100) })
  name: string; // "Color"

  // Unique per vendor; unique globally when vendor_id IS NULL
  @AllowNull(false)
  @Column({ type: DataType.STRING(100) })
  code: string; // "color" (URL-safe, lowercase)

  @Column({ type: DataType.TEXT })
  description: string;

  // ============ BEHAVIOR ============
  @Default(AttributeTypeEnum.SELECT)
  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(AttributeTypeEnum)),
  })
  type: AttributeTypeEnum;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  sort_order: number;

  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  is_filterable: boolean;

  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  is_visible: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  is_variant_attribute: boolean;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  is_required: boolean;

  // Platform can lock a vendor attribute to prevent vendor edits
  // (e.g., an admin-defined "Color" that vendors must use as-is)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  is_locked: boolean;

  // ============ RELATIONS ============
  @HasMany(() => AttributeValueModel, {
    foreignKey: 'attribute_id',
    as: 'values',
  })
  values: AttributeValueModel[];

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

  // ============ VIRTUALS ============

  get is_platform(): boolean {
    return this.vendor_id === null;
  }

  get is_vendor_owned(): boolean {
    return this.vendor_id !== null;
  }
}