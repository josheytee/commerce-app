import {
  Column,
  DataType,
  Model,
  Table,
  HasMany,
  AutoIncrement,
  PrimaryKey,
} from 'sequelize-typescript';
import { State } from '../state/state.model';

@Table({ tableName: 'countries', underscored: true })
export class Country extends Model<Country> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code: string;

  @HasMany(() => State)
  states: State[];
}
