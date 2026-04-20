import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  DataType,
  AllowNull,
  HasMany,
  Index,
} from 'sequelize-typescript';
import { AttributeModel } from './attribute.model';
import { ProductVariantAttributeValueModel } from './product-variant-attribute-values.model';

@Table({
  tableName: 'attribute_values',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['attribute_id', 'sort_order'] },
    { fields: ['value'], name: 'attr_value_idx' }, // For search
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
    as: 'attribute'
  })
  attribute: AttributeModel;

  @AllowNull(false)
  @Column({ type: DataType.STRING(100) })
  value: string; // "Red"

  @Column({ type: DataType.STRING(100) })
  display_value: string; // "Crimson Red" (pretty name)

  @Column({ type: DataType.STRING(7) }) // Hex color
  color_code: string; // "#FF0000" for color attributes

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  sort_order: number;

  @Column({ type: DataType.STRING(255) })
  image_url: string; // Swatch image

  @HasMany(() => ProductVariantAttributeValueModel, {
    foreignKey: 'attribute_value_id',
    as: 'variantAttributeValues', // Explicit alias
  })
  variantAttributeValues: ProductVariantAttributeValueModel[]; // For eager loading
}
