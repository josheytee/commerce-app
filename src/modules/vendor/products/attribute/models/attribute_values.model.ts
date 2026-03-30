import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ProductAttribute } from './product_attribute.model';
import { Attribute } from './attribute.model';

@Table({
  tableName: 'product_attribute_values',
  underscored: true,
})
export class AttributeValue extends Model<AttributeValue> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id: number;

  @ForeignKey(() => Attribute)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  attribute_id: number;

  @BelongsTo(() => Attribute)
  attribute: Attribute;

  @Column({
    type: DataType.JSONB, // This allows storing any type of value
    allowNull: false,
  })
  value: any; // This can be a string, number, array, or object

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  unit: string; // Optional unit for the attribute, e.g., 'kg', 'cm', etc.
}
