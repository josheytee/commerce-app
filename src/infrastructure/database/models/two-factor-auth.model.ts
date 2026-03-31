// src/models/two-factor-auth.model.ts
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
import { UserModel } from './user.model';

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'two_factor_auths',
})
export class TwoFactorAuthModel extends Model<TwoFactorAuthModel> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column(DataType.INTEGER)
  user_id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  secret!: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  created_at!: Date;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}
