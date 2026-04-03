import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  HasMany,
  BelongsToMany,
  HasOne,
} from 'sequelize-typescript';
import { IUser } from 'src/shared';
import { SessionModel } from './session.model';
import { PasswordResetModel } from './password-reset.model';
import { UserVendorRoleModel } from './user-vendor-role.model';
import { AuditLogModel } from './audit-log.model';
import { VendorModel } from './vendor.model';
import { RoleModel } from './role.model';
import { StoreModel } from './store.model';
import { UserStoreRoleModel } from './user-store-role.model';
import { TwoFactorAuthModel } from './two-factor-auth.model';
import { CustomerModel } from './customer.model';

@Table({
  timestamps: true,
  underscored: true,
  paranoid: true,
  tableName: 'users',
})
export class UserModel extends Model<UserModel> implements IUser {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  username!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password_hash!: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.STRING)
  first_name?: string;

  @Column(DataType.STRING)
  last_name?: string;

  @Column({
    type: DataType.ENUM,
    values: ['male', 'female'],
    allowNull: false,
  })
  gender?: string;

  @Column(DataType.STRING)
  phone_number?: string;

  @Column(DataType.DATE)
  dob?: string;

  @Column(DataType.DATE)
  verified_at?: string;

  @Column(DataType.DATE)
  last_login?: string;

  @HasMany(() => SessionModel)
  sessions!: SessionModel[];

  @HasMany(() => PasswordResetModel)
  passwordResets!: PasswordResetModel[];

  @HasMany(() => TwoFactorAuthModel)
  twoFactorAuths!: TwoFactorAuthModel[];

  @HasMany(() => AuditLogModel)
  auditLogs!: AuditLogModel[];

  @BelongsToMany(() => VendorModel, () => UserVendorRoleModel)
  vendors: VendorModel[];

  @HasOne(() => CustomerModel)
  customer: CustomerModel;

  @BelongsToMany(() => RoleModel, () => UserVendorRoleModel)
  roles: RoleModel[];

  @BelongsToMany(() => StoreModel, () => UserStoreRoleModel)
  stores: StoreModel[];

  toJSON() {
    const values = { ...this.get() };
    delete values.password_hash;
    return values;
  }
}
