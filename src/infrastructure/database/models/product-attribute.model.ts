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
import { AttributeModel } from './attribute.model';
import { ProductModel } from './product.model';

@Table({
  tableName: 'product_attributes',
  timestamps: true,
  underscored: true,
})
export class ProductAttributeModel extends Model<ProductAttributeModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => ProductModel)
  @Column({
    allowNull: false,
  })
  product_id: number;

  @Column({
    allowNull: false,
  })
  @ForeignKey(() => AttributeModel)
  attribute_id!: number;

  @BelongsTo(() => AttributeModel)
  attribute: AttributeModel;

  @Column(DataType.JSONB)
  value: any;

  @BelongsTo(() => ProductModel)
  product: ProductModel;
}
