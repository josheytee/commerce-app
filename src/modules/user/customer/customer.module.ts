import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerModel } from 'src/infrastructure';

@Module({
  imports: [SequelizeModule.forFeature([CustomerModel])],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule { }
