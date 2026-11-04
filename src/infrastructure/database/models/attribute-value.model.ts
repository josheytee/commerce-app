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
import { AttributeModel } from './attribute.model';
import { ProductVariantAttributeValueModel } from './product-variant-attribute-values.model';

@Table({
  tableName: 'attribute_values',
  timestamps: true,
  underscored: true,
  paranoid: true, // soft-delete: preserves variant→value links
  indexes: [
    // Prevents duplicate values under the same attribute
    {
      name: 'attribute_values_attr_value_uidx',
      unique: true,
      fields: ['attribute_id', 'value'],
    },
    // UI ordering & admin listings
    { fields: ['attribute_id', 'sort_order'], name: 'attribute_values_sort_idx' },
    // Reverse lookup for "which attributes use this value" (rare but useful)
    { fields: ['attribute_id'], name: 'attribute_values_attribute_id_idx' },
  ],
})
export class AttributeValueModel extends Model<AttributeValueModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => AttributeModel)
  @AllowNull(false)
  @Column
  attribute_id: number;

  @BelongsTo(() => AttributeModel, {
    foreignKey: 'attribute_id',
    as: 'attribute',
  })
  attribute: AttributeModel;

  // ============ VALUE ============
  @AllowNull(false)
  @Column({ type: DataType.STRING(100) })
  value: string; // "Red", "42", "XL" — canonical, used in matching

  @Column({ type: DataType.STRING(100) })
  display_value: string; // "Crimson Red" — pretty label for UI

  // Hex color — supports #RGB, #RRGGBB, #RRGGBBAA
  @Column({ type: DataType.STRING(9) })
  color_code: string;

  @Column({ type: DataType.STRING(255) })
  image_url: string; // Swatch image (UI-only, not a catalog asset)

  // ============ DISPLAY ============
  @Default(0)
  @Column({ type: DataType.INTEGER })
  sort_order: number;

  // ============ RELATIONS ============
  @HasMany(() => ProductVariantAttributeValueModel, {
    foreignKey: 'attribute_value_id',
    as: 'variant_attribute_values',
  })
  variant_attribute_values: ProductVariantAttributeValueModel[];

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

  get label(): string {
    return this.display_value || this.value;
  }
}
