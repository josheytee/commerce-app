import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'addresses',
  timestamps: true,
  underscored: true,
})
export class Address extends Model<Address> {
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
    type: DataType.STRING,
    allowNull: false,
  })
  city_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  state_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  country_id!: string;
}
