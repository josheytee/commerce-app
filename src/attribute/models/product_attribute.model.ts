import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Product } from 'src/product/product.model';
import { Attribute } from './attribute.model';

@Table({
  tableName: 'product_attributes',
  timestamps: true,
  underscored: true,
})
export class ProductAttribute extends Model<ProductAttribute> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Product)
  @Column({
    allowNull: false,
  })
  product_id: number;

  @Column({
    allowNull: false,
  })
  @ForeignKey(() => Attribute)
  attribute_id!: number;

  @BelongsTo(() => Attribute)
  attribute: Attribute;

  @Column(DataType.JSONB)
  value: any;

  @BelongsTo(() => Product)
  product: Product;
}
