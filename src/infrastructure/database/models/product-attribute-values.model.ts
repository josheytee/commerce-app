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
import { ProductModel } from './product.model';
import { AttributeModel } from './attribute.model';
import { AttributeValueModel } from './attribute-value.model';
@Table({
  tableName: 'product_attribute_values',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['product_id', 'attribute_id'], unique: true },
    { fields: ['attribute_id', 'attribute_value_id'] }, // Filter by attribute value
  ],
})
export class ProductAttributeValueModel extends Model<ProductAttributeValueModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => ProductModel)
  @AllowNull(false)
  @Column
  product_id: number;

  @BelongsTo(() => ProductModel)
  product: ProductModel;

  @ForeignKey(() => AttributeModel)
  @AllowNull(false)
  @Column
  attribute_id: number;

  @BelongsTo(() => AttributeModel)
  attribute: AttributeModel;

  // For SELECT/MULTI_SELECT: reference predefined value
  @ForeignKey(() => AttributeValueModel)
  @Column
  attribute_value_id: number;

  @BelongsTo(() => AttributeValueModel)
  attribute_value: AttributeValueModel;

  // For TEXT/NUMBER/BOOLEAN: free-form value
  @Column({ type: DataType.TEXT })
  custom_value: string;

  // Which value to use?
  get display_value(): string {
    return this.attribute_value?.value ?? this.custom_value ?? '';
  }
}
