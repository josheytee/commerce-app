import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  AllowNull,
} from 'sequelize-typescript';
import { User } from 'src/account/user/models/user.model';
import { Vendor } from 'src/account/vendor/vendor.model';

@Table
export class UserRole extends Model<UserRole> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @AllowNull(false)
  @ForeignKey(() => Vendor)
  @Column(DataType.INTEGER)
  role_id: number;
}
