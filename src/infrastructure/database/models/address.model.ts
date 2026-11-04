// src/infrastructure/database/models/address.model.ts
import { Op } from 'sequelize';
import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  DataType,
  Scopes,
  DefaultScope,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { AddressableTypeEnum, AddressTypeEnum } from 'src/shared';
import { CountryModel } from './country.model';
import { StateModel } from './state.model';
import { CityModel } from './city.model';

@DefaultScope(() => ({
  include: [
    { model: CityModel, as: 'city' },
    { model: StateModel, as: 'state' },
    { model: CountryModel, as: 'country' },
  ],
}))
@Scopes(() => ({
  customers: { where: { addressable_type: AddressableTypeEnum.CUSTOMER } },
  stores: { where: { addressable_type: AddressableTypeEnum.STORE } },
  onlyDefault: { where: { is_default: true } },
  withCoordinates: {
    where: {
      latitude: { [Op.ne]: null },
      longitude: { [Op.ne]: null },
    },
  },
  verified: { where: { is_verified: true } },
}))
@Table({
  tableName: 'addresses',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class AddressModel extends Model<AddressModel> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  // ============ POLYMORPHIC OWNER ============
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'addressable_id' })
  addressable_id: number;

  @Column({
    type: DataType.ENUM(...Object.values(AddressableTypeEnum)),
    allowNull: false,
    field: 'addressable_type',
  })
  addressable_type: AddressableTypeEnum;

  // ============ ADDRESS METADATA ============
  @Column({
    type: DataType.ENUM(...Object.values(AddressTypeEnum)),
    allowNull: false,
    defaultValue: AddressTypeEnum.BOTH,
    field: 'address_type',
  })
  address_type: AddressTypeEnum;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'e.g., Home, Office, Main StoreModel, Warehouse',
  })
  label: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'contact_name',
    comment: 'Person of contact at this address',
  })
  contact_name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'contact_phone',
  })
  contact_phone: string;

  // ============ ADDRESS LINES ============
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'address_line1',
  })
  address_line1: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'address_line2',
  })
  address_line2: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  landmark: string;

  // ============ LOCATION FKs ============
  @ForeignKey(() => CityModel)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'city_id' })
  city_id: number;

  @ForeignKey(() => StateModel)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'state_id' })
  state_id: number;

  @ForeignKey(() => CountryModel)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'country_id' })
  country_id: number;

  // ============ POSTAL ============
  @Column({ type: DataType.STRING(20), allowNull: true, field: 'postal_code' })
  postal_code: string;

  @Column({ type: DataType.STRING(50), allowNull: true, field: 'po_box' })
  po_box: string;

  // ============ FLAGS ============
  @Column({ type: DataType.BOOLEAN, defaultValue: false, field: 'is_default' })
  is_default: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false, field: 'is_verified' })
  is_verified: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'delivery_instructions',
  })
  delivery_instructions: string;

  // ============ GEO ============
  @Column({ type: DataType.DECIMAL(10, 8), allowNull: true })
  latitude: number;

  @Column({ type: DataType.DECIMAL(11, 8), allowNull: true })
  longitude: number;

  // ============ TIMESTAMPS ============
  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  deleted_at: Date;

  // ============ ASSOCIATIONS ============
  @BelongsTo(() => CityModel, { foreignKey: 'city_id', as: 'city' })
  city: CityModel;

  @BelongsTo(() => StateModel, { foreignKey: 'state_id', as: 'state' })
  state: StateModel;

  @BelongsTo(() => CountryModel, { foreignKey: 'country_id', as: 'country' })
  country: CountryModel;

  // ============ HELPERS ============

  getFullAddress(): string {
    return [
      this.address_line1,
      this.address_line2,
      this.city?.name,
      this.state?.name,
      this.country?.name,
      this.postal_code,
    ]
      .filter(Boolean)
      .join(', ');
  }

  getCoordinates(): { lat: number; lng: number } | null {
    if (this.latitude && this.longitude) {
      return { lat: Number(this.latitude), lng: Number(this.longitude) };
    }
    return null;
  }
}
