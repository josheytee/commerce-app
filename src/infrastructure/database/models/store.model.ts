import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
  DataType,
} from 'sequelize-typescript';
import { InventoryModel } from 'src/infrastructure/database/models/inventory.model';
import { StoreCustomer } from './store-customer.model';
import { SectionModel } from 'src/infrastructure/database/models/section.model';
import { AddressModel } from 'src/infrastructure/database/models/address.model';
import { CustomerModel } from 'src/infrastructure/database/models/customer.model';
import { UserStoreRoleModel } from './user-store-role.model';
import { RoleModel } from 'src/infrastructure/database/models/role.model';
import { VendorModel } from './vendor.model';

@Table({
  timestamps: true,
  underscored: true,
  // paranoid: true,
  tableName: 'stores',
})
export class StoreModel extends Model<StoreModel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  description: string;

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
