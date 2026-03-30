import {
  Table,
  Column,
  Model,
  HasMany,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Vendor } from 'src/modules/vendor/onboarding/vendor.model';

@Table({
  timestamps: true,
  underscored: true,
  // paranoid: true,
  tableName: 'categories',
})
export class Category extends Model<Category> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  description: string;

  @HasMany(() => Vendor)
  vendors: Vendor[];
}
