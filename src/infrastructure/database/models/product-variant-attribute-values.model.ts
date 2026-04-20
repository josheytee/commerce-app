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
  Index,
} from 'sequelize-typescript';
import { ProductVariantModel } from './product-variant.model';
import { AttributeModel } from './attribute.model';
import { AttributeValueModel } from './attribute-value.model';

@Table({
  tableName: 'product_variant_attribute_values',
  timestamps: false, // No changes needed
  underscored: true,
  indexes: [
    { fields: ['variant_id', 'attribute_id'], unique: true },
    { fields: ['attribute_id', 'attribute_value_id'] }, // "Find all red variants"
  ],
})
export class ProductVariantAttributeValueModel extends Model<ProductVariantAttributeValueModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => ProductVariantModel)
  @AllowNull(false)
  @Column
  variant_id: number;

  @BelongsTo(() => ProductVariantModel, {
    foreignKey: 'variant_id',
    as: 'variant', // ✅ This should match the inverse
  })
  variant: ProductVariantModel;

  @ForeignKey(() => AttributeModel)
  @AllowNull(false)
  @Column
  attribute_id: number;

  @BelongsTo(() => AttributeModel, {
    foreignKey: 'attribute_id',
    as: 'attribute', // ✅ This should match the inverse
  })
  attribute: AttributeModel;

  @ForeignKey(() => AttributeValueModel)
  @AllowNull(false)
  @Column
  attribute_value_id: number;

  @BelongsTo(() => AttributeValueModel, {
    foreignKey: 'attribute_value_id',
    as: 'attribute_value', // ✅ This should match the inverse
  })
  attribute_value: AttributeValueModel;

  // Convenience getter
  get value(): string {
    return this.attribute_value?.value;
  }

  get display_value(): string {
    return this.attribute_value?.display_value || this.value;
  }
}
