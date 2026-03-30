import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

import { PaymentModule } from 'src/infrastructure/payment/payment.module';
import { CustomerModule } from 'src/modules/user/customer/customer.module';
import { OrderModel, OrderItemModel } from 'src/infrastructure';


@Module({
  imports: [
    SequelizeModule.forFeature([OrderModel, OrderItemModel]),
    forwardRef(() => PaymentModule), // Use forwardRef to resolve circular dependency
    forwardRef(() => CustomerModule), // Use forwardRef to resolve circular dependency
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule { }
