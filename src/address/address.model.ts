import {
  Table,
  Column,
  Model,
  DataType,
  AutoIncrement,
  PrimaryKey,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Country } from './country/country.model';
import { State } from './state/state.model';
import { City } from './city/city.model';
import { Customer } from 'src/account/customer/customer.model';

@Table({
  tableName: 'addresses',
  timestamps: true,
  underscored: true,
})
export class Address extends Model<Address> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  first_name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  last_name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address2!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  zip_code!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  po_box!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  is_default!: boolean;

  @Column({
    allowNull: false,
  })
  @ForeignKey(() => Customer)
  customer_id!: number;

  @BelongsTo(() => Customer)
  customer: Customer;

  @Column({
    allowNull: false,
  })
  @ForeignKey(() => City)
  city_id!: number;

  @BelongsTo(() => City)
  city: City;

  @Column({
    allowNull: false,
  })
  @ForeignKey(() => State)
  state_id!: number;

  @BelongsTo(() => State)
  state: State;

  @Column({
    allowNull: false,
  })
  @ForeignKey(() => Country)
  country_id!: number;

  @BelongsTo(() => Country)
  country: Country;
}
