import {
  Column,
  DataType,
  Model,
  Table,
  HasMany,
  AutoIncrement,
  PrimaryKey,
} from 'sequelize-typescript';
import { StateModel } from './state.model';

@Table({ tableName: 'countries', underscored: true })
export class CountryModel extends Model<CountryModel> {
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

  @HasMany(() => StateModel)
  states: StateModel[];
}
