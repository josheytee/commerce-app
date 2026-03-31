import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { CountryModel } from './country.model';
import { CityModel } from './city.model';


@Table({ tableName: 'states', underscored: true })
export class StateModel extends Model<StateModel> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => CountryModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  country_id: number;

  @BelongsTo(() => CountryModel)
  country: CountryModel;

  @HasMany(() => CityModel)
  cities: CityModel[];
}
