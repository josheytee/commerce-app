import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { Store } from '../models/store.model';
import { User } from 'src/account/user/models/user.model';

@Table({
  timestamps: true,
  underscored: true,
  // paranoid: true,
  tableName: 'vendors',
})
export class Vendor extends Model<Vendor> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  business_name: string;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Store)
  stores: Store[];
}
