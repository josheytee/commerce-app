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
} from 'sequelize-typescript';
import { ProductVariantModel } from './product-variant.model';
import { AttributeModel } from './attribute.model';
import { AttributeValueModel } from './attribute-value.model';

@Table({
  tableName: 'product_variant_attribute_values',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      name: 'pvav_variant_attr_unique',
      unique: true,
      fields: ['variant_id', 'attribute_id'],
    },
    { fields: ['attribute_id', 'attribute_value_id'] },
    { fields: ['variant_id'] },
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
    as: 'variant',
  })
  variant: ProductVariantModel;

  @ForeignKey(() => AttributeModel)
  @AllowNull(false)
  @Column
  attribute_id: number;

  @BelongsTo(() => AttributeModel, {
    foreignKey: 'attribute_id',
    as: 'attribute',
  })
  attribute: AttributeModel;

  @ForeignKey(() => AttributeValueModel)
  @AllowNull(false)
  @Column
  attribute_value_id: number;

  @BelongsTo(() => AttributeValueModel, {
    foreignKey: 'attribute_value_id',
    as: 'attribute_value',
  })
  attribute_value: AttributeValueModel;

  get value(): string {
    return this.attribute_value?.value;
  }

  get display_value(): string {
    return this.attribute_value?.display_value || this.value;
  }
}