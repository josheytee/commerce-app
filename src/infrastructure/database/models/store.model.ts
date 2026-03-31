import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  PrimaryKey,
  Table,
  Model,
} from 'sequelize-typescript';
import { AddressModel } from './address.model';
import { VendorModel } from './vendor.model';
import { CustomerModel } from './customer.model';
import { StoreCustomer } from './store-customer.model';
import { SectionModel } from './section.model';
import { InventoryModel } from './inventory.model';
import { RoleModel } from './role.model';
import { UserStoreRoleModel } from './user-store-role.model';

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'stores',
})
export class StoreModel extends Model<StoreModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  slug: string;

  @Column(DataType.STRING)
  meta_title: string;

  @Column(DataType.TEXT)
  meta_description: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  tags: string[];

  @Column({
    type: DataType.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'inactive',
  })
  status: 'active' | 'inactive' | 'suspended';

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_verified: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_featured: boolean;

  @ForeignKey(() => AddressModel)
  @Column
  address_id: number;

  @BelongsTo(() => AddressModel)
  address: AddressModel;

  @ForeignKey(() => VendorModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  vendor_id: number;

  @BelongsTo(() => VendorModel)
  vendor: VendorModel;

  @BelongsToMany(() => CustomerModel, () => StoreCustomer)
  customers: CustomerModel[];

  @HasMany(() => SectionModel)
  sections: SectionModel[];

  @HasMany(() => InventoryModel)
  inventories: InventoryModel[];

  @BelongsToMany(() => RoleModel, () => UserStoreRoleModel)
  roles: RoleModel[];
}
