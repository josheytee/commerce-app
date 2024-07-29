// src/models/user-role.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  ForeignKey,
} from 'sequelize-typescript';
import { Role } from './role.model';
import { Vendor } from 'src/account/vendor/vendor.model';

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'user_roles',
})
export class VendorRole extends Model<VendorRole> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @ForeignKey(() => Vendor)
  @Column(DataType.INTEGER)
  vendor_id!: number;

  @AllowNull(false)
  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  role_id!: number;
}
