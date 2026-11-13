// src/infrastructure/database/models/attribute-value.model.ts
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { AttributeModel } from './attribute.model';

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'attribute_values',
  indexes: [
    { fields: ['attribute_id'], name: 'attr_values_attribute_idx' },
    {
      unique: true,
      fields: ['attribute_id', 'value'],
      name: 'attr_values_attr_value_unique',
    },
    { fields: ['attribute_id', 'sort_order'], name: 'attr_values_sort_idx' },
  ],
})
export class AttributeValueModel extends Model<AttributeValueModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => AttributeModel)
  @AllowNull(false)
  @Column({ onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  attribute_id: number;

  @BelongsTo(() => AttributeModel, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  attribute: AttributeModel;

  // Internal value used for filtering / lookups (e.g. "red", "xl")
  @AllowNull(false)
  @Column({ type: DataType.STRING(100) })
  value: string;

  // What the user sees ("Red", "Extra Large")
  @AllowNull(false)
  @Column({ type: DataType.STRING(150) })
  display_value: string;

  // Optional hex color (only for color-type attributes)
  @AllowNull(true)
  @Column({ type: DataType.STRING(20) })
  code: string | null;

  //Optional swatch image (patterns, product photos as swatches)
  @AllowNull(true)
  @Column({ type: DataType.STRING(500) })
  image_url: string | null;

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  sort_order: number;

  @Default(true)
  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN })
  is_active: boolean;

}
