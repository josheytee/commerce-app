import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel } from 'src/infrastructure';
import { AddressModule } from './addresses/address.module';

@Module({
  imports: [AddressModule, SequelizeModule.forFeature([UserModel])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule { }
