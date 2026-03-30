import {
  Model,
  Table,
  Column,
  DataType,
  PrimaryKey,
  HasMany,
  AutoIncrement,
} from 'sequelize-typescript';
import { ProductAttribute } from './product_attribute.model';

@Table({
  tableName: 'attributes',
  underscored: true,
})
export class Attribute extends Model<Attribute> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.ENUM('string', 'number', 'boolean', 'date', 'json'))
  type: 'string' | 'number' | 'boolean' | 'date' | 'json';

  @HasMany(() => ProductAttribute)
  productAttributes: ProductAttribute[];
}
