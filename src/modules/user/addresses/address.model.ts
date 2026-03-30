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
} from 'sequelize-typescript';
import { Country } from './country/country.model';
import { State } from './state/state.model';
import { City } from './city/city.model';
import { Customer } from '../customer/customer.model';
import { Store } from 'src/modules/vendor/store/models/store.model';

export enum AddressableType {
  CUSTOMER = 'customer',
  STORE = 'store',
}

export enum AddressType {
  SHIPPING = 'shipping',
  BILLING = 'billing',
  BOTH = 'both',
  PHYSICAL = 'physical',
  POSTAL = 'postal',
  WAREHOUSE = 'warehouse',
  RETURNS = 'returns',
}

@DefaultScope(() => ({
  include: [
    { model: City, as: 'city' },
    { model: State, as: 'state' },
    { model: Country, as: 'country' },
  ],
}))
@Scopes(() => ({
  customers: {
    where: { addressable_type: AddressableType.CUSTOMER },
  },
  stores: {
    where: { addressable_type: AddressableType.STORE },
  },
  default: {
    where: { is_default: true },
  },
  primaryStores: {
    where: {
      addressable_type: AddressableType.STORE,
      is_primary_store: true,
    },
  },
  withCoordinates: {
    where: {
      latitude: { [Op.ne]: null },
      longitude: { [Op.ne]: null },
    },
  },
  verified: {
    where: { is_verified: true },
  },
}))
@Table({
  tableName: 'addresses',
  underscored: true,
  paranoid: true, // Adds deleted_at column
  timestamps: true,
})
export class Address extends Model<Address> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  // Polymorphic fields
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'addressable_id',
  })
  addressable_id: number;

  @Column({
    type: DataType.ENUM(...Object.values(AddressableType)),
    allowNull: false,
    field: 'addressable_type',
  })
  addressable_type: AddressableType;

  // Address metadata
  @Column({
    type: DataType.ENUM(...Object.values(AddressType)),
    allowNull: false,
    defaultValue: AddressType.BOTH,
    field: 'address_type',
  })
  address_type: AddressType;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'e.g., Home, Office, Main Store, Warehouse',
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

  // Address lines
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

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  landmark: string;

  // Location foreign keys
  @ForeignKey(() => City)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'city_id',
  })
  city_id: number;

  @ForeignKey(() => State)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'state_id',
  })
  state_id: number;

  @ForeignKey(() => Country)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'country_id',
  })
  country_id: number;

  // Postal details
  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    field: 'postal_code',
  })
  postal_code: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'po_box',
  })
  po_box: string;

  // Flags
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'is_default',
    comment: 'Default address for this entity',
  })
  is_default: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'is_primary_store',
    comment: 'For stores - is this the primary location',
  })
  is_primary_store: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'is_verified',
  })
  is_verified: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'delivery_instructions',
  })
  delivery_instructions: string;

  // Geo coordinates
  @Column({
    type: DataType.DECIMAL(10, 8),
    allowNull: true,
  })
  latitude: number;

  @Column({
    type: DataType.DECIMAL(11, 8),
    allowNull: true,
  })
  longitude: number;

  // Timestamps
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updated_at: Date;

  @Column({
    type: DataType.DATE,
    field: 'deleted_at',
  })
  deleted_at: Date;

  // Associations
  @BelongsTo(() => City, 'city_id')
  city: City;

  @BelongsTo(() => State, 'state_id')
  state: State;

  @BelongsTo(() => Country, 'country_id')
  country: Country;

  // Virtual fields for getting parent entity
  async getAddressableEntity(): Promise<Customer | Store | null> {
    if (this.addressable_type === AddressableType.CUSTOMER) {
      return Customer.findByPk(this.addressable_id);
    } else if (this.addressable_type === AddressableType.STORE) {
      return Store.findByPk(this.addressable_id);
    }
    return null;
  }

  // Helper methods
  getFullAddress(): string {
    const parts = [
      this.address_line1,
      this.address_line2,
      this.city?.name,
      this.state?.name,
      this.country?.name,
      this.postal_code,
    ].filter(Boolean);
    return parts.join(', ');
  }

  getCoordinates(): { lat: number; lng: number } | null {
    if (this.latitude && this.longitude) {
      return { lat: this.latitude, lng: this.longitude };
    }
    return null;
  }
}
