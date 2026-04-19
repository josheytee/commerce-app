import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  AllowNull,
  Unique,
  HasMany,
  Index,
} from 'sequelize-typescript';
import { AttributeValueModel } from './attribute-value.model';
import { AttributeTypeEnum } from 'src/shared';

@Table({
  tableName: 'attributes',
  timestamps: true,
  underscored: true,
})
export class AttributeModel extends Model<AttributeModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(100) })
  name: string; // "Color"

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING(100) })
  code: string; // "color" (URL-friendly)

  @Column({ type: DataType.TEXT })
  description: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(AttributeTypeEnum)),
    defaultValue: AttributeTypeEnum.SELECT,
  })
  type: AttributeTypeEnum;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  sort_order: number; // Display order in filters

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  is_filterable: boolean; // Show in sidebar filters?

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  is_visible: boolean; // Show on product page?

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_variant_attribute: boolean; // Can be used for variants?

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_required: boolean;

  // Predefined values for SELECT/MULTI_SELECT types
  @HasMany(() => AttributeValueModel)
  values: AttributeValueModel[];
}
