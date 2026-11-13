// src/infrastructure/database/models/attribute.model.ts
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  DataType,
  HasMany,
  Default,
  CreatedAt,
  UpdatedAt,
  Unique,
  Index,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { AttributeValueModel } from './attribute-value.model';
import { ProductVariantAttributeValueModel } from './product-variant-attribute-values.model';
import { VendorModel } from './vendor.model';

export enum AttributeTypeEnum {
  TEXT = 'text',        // free-form text input
  SELECT = 'select',    // single choice from a list
  COLOR = 'color',      // color swatch (requires color_code on values)
  NUMBER = 'number',    // numeric input
  BOOLEAN = 'boolean',  // yes/no
}

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'attributes',
  indexes: [
    { fields: ['slug'], name: 'attributes_slug_idx' },
    { fields: ['name'], name: 'attributes_name_idx' },
  ],
})
export class AttributeModel extends Model<AttributeModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  // ============ OWNERSHIP ============
  // NULL = platform attribute (admin-managed, global)
  // set  = vendor-owned attribute
  @ForeignKey(() => VendorModel)
  @AllowNull(true)
  @Column
  vendor_id: number | null;

  @BelongsTo(() => VendorModel, {
    foreignKey: 'vendor_id',
    as: 'vendor',
  })
  vendor: VendorModel;

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.STRING(100) })
  name: string;

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.STRING(120) })
  slug: string;

  @Default(AttributeTypeEnum.SELECT)
  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(AttributeTypeEnum)),
  })
  type: AttributeTypeEnum;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  description: string | null;

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  sort_order: number;

  @Default(true)
  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN })
  is_active: boolean;

  @HasMany(() => AttributeValueModel, {
    foreignKey: 'attribute_id',
    as: 'values',
    onDelete: 'CASCADE',
  })
  values: AttributeValueModel[];

  @HasMany(() => ProductVariantAttributeValueModel, {
    foreignKey: 'attribute_id',
    as: 'variant_assignments',
  })
  variant_assignments: ProductVariantAttributeValueModel[];
}
