import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  PrimaryKey,
} from 'sequelize-typescript';
import { State } from '../state/state.model';

@Table({ tableName: 'cities', underscored: true })
export class City extends Model<City> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => State)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  state_id: number;

  @BelongsTo(() => State)
  state: State;
}
