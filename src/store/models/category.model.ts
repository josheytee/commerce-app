import {
  Table,
  Column,
  Model,
  HasMany,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Store } from './store.model';

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

  @HasMany(() => Store)
  stores: Store[];
}
