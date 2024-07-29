import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from './customer.model';

@Module({
  imports: [SequelizeModule.forFeature([Customer])],
  providers: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}
