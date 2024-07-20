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
} from 'sequelize-typescript';
import { Session } from '../../session/session.model';
import { PasswordReset } from '../../password-reset/password-reset.model';
import { TwoFactorAuth } from '../../two-factor-auth/two-factor-auth.model';
import { AuditLog } from '../../audit-log/audit-log.model';
import { UserRole } from '../../role/models/user-role.model';

@Table({
  timestamps: true,
  underscored: true,
  paranoid: true,
  tableName: 'users',
})
export class User extends Model<User> {
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



  @HasMany(() => UserRole)
  userRoles!: UserRole[];

  @HasMany(() => Session)
  sessions!: Session[];

  @HasMany(() => PasswordReset)
  passwordResets!: PasswordReset[];

  @HasMany(() => TwoFactorAuth)
  twoFactorAuths!: TwoFactorAuth[];

  @HasMany(() => AuditLog)
  auditLogs!: AuditLog[];
}
