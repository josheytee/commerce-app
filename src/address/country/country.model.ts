import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { State } from '../state/state.model';

@Table({ tableName: 'countries', underscored: true })
export class Country extends Model<Country> {
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
