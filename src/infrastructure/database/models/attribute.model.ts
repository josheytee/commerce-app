import {
  Model,
  Table,
  Column,
  DataType,
  PrimaryKey,
  HasMany,
  AutoIncrement,
} from 'sequelize-typescript';
import { ProductAttributeModel } from './product-attribute.model';

@Table({
  tableName: 'attributes',
  underscored: true,
})
export class AttributeModel extends Model<AttributeModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.ENUM('string', 'number', 'boolean', 'date', 'json'))
  type: 'string' | 'number' | 'boolean' | 'date' | 'json';

  @HasMany(() => ProductAttributeModel)
  productAttributes: ProductAttributeModel[];
}
