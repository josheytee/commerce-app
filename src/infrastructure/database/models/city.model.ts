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
import { StateModel } from './state.model';

@Table({ tableName: 'cities', underscored: true })
export class CityModel extends Model<CityModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => StateModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  state_id: number;

  @BelongsTo(() => StateModel)
  state: StateModel;
}
