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
import { User } from '../../user/models/user.model';
import { Role } from './role.model';

@Table({
  timestamps: true,
  underscored: true,
  tableName: 'user_roles',
})
export class UserRole extends Model<UserRole> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id!: number;

  @AllowNull(false)
  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  role_id!: number;
}
