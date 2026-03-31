// src/models/session.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { UserModel } from './user.model';

@Table({
  timestamps: true,
  underscored: true,
  paranoid: true,
  tableName: 'sessions',
})
export class SessionModel extends Model<SessionModel> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column(DataType.INTEGER)
  user_id!: number;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @AllowNull(false)
  @Column(DataType.STRING)
  token!: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  expires_at!: Date;
}
