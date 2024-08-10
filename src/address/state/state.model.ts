import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Country } from '../country/country.model';
import { City } from '../city/city.model';

@Table({ tableName: 'states', underscored: true })
export class State extends Model<State> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => Country)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  country_id: number;

  @BelongsTo(() => Country)
  country: Country;

  @HasMany(() => City)
  cities: City[];
}
