// src/models/user.model.ts
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
} from 'sequelize-typescript';
import { Session } from '../../session/session.model';
import { PasswordReset } from '../../password-reset/password-reset.model';
import { TwoFactorAuth } from '../../two-factor-auth/two-factor-auth.model';
import { AuditLog } from '../../audit-log/audit-log.model';
import { User as IUser } from '../interfaces/user.interface';
import { Vendor } from 'src/account/vendor/vendor.model';
import { Role } from 'src/account/role/models/role.model';
import { Store } from 'src/store/models/store.model';
import { UserStoreRole } from './user-store-role.model';

@Table({
  timestamps: true,
  underscored: true,
  paranoid: true,
  tableName: 'users',
})
export class User extends Model<IUser> implements IUser {
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

  @HasMany(() => Session)
  sessions!: Session[];

  @HasMany(() => PasswordReset)
  passwordResets!: PasswordReset[];

  @HasMany(() => TwoFactorAuth)
  twoFactorAuths!: TwoFactorAuth[];

  @HasMany(() => AuditLog)
  auditLogs!: AuditLog[];

  @HasMany(() => Vendor)
  vendors: Vendor[];

  @BelongsToMany(() => Store, () => UserStoreRole)
  stores: Store[];

  @BelongsToMany(() => Role, () => UserStoreRole)
  roles: Role[];

  toJSON() {
    const values = { ...this.get() };
    delete values.password_hash;
    return values;
  }
}
