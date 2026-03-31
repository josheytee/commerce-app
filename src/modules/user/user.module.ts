import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel } from 'src/infrastructure';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule { }
