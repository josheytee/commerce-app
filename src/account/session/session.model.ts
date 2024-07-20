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
} from 'sequelize-typescript';
import { User } from '../user/models/user.model';

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'sessions',
})
export class Session extends Model<Session> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  session_id!: number;

  @AllowNull(false)
  @ForeignKey(() => User)
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
