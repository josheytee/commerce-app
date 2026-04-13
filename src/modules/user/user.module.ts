import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CustomerModel, UserModel } from 'src/infrastructure';
import { AddressModule } from './addresses/address.module';
import {
  UserRepository,
  CustomerRepository,
} from 'src/infrastructure/database/repositories';

@Module({
  imports: [
    AddressModule,
    SequelizeModule.forFeature([UserModel, CustomerModel]),
  ],
  providers: [UserService, UserRepository, CustomerRepository],
  controllers: [UserController],
  exports: [UserService, UserRepository, CustomerRepository],
})
export class UserModule { }
