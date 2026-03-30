import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderItem } from './models/order-item.model';
import { Order } from './models/order.model';
import { PaymentModule } from 'src/infrastructure/payment/payment.module';
import { CustomerModule } from 'src/modules/user/customer/customer.module';


@Module({
  imports: [
    SequelizeModule.forFeature([Order, OrderItem]),
    forwardRef(() => PaymentModule), // Use forwardRef to resolve circular dependency
    forwardRef(() => CustomerModule), // Use forwardRef to resolve circular dependency
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule { }
