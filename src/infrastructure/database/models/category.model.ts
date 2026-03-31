import {
  Table,
  Column,
  Model,
  HasMany,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { VendorModel } from 'src/infrastructure/database/models/vendor.model';

@Table({
  timestamps: true,
  underscored: true,
  // paranoid: true,
  tableName: 'categories',
})
export class CategoryModel extends Model<CategoryModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  description: string;

  @HasMany(() => VendorModel)
  vendors: VendorModel[];
}
