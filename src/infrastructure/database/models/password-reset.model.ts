// src/models/password-reset.model.ts
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
  tableName: 'password_resets',
})
export class PasswordResetModel extends Model<PasswordResetModel> {
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
  token!: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  created_at!: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  expires_at!: Date;
}
