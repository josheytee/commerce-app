import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderItem } from './models/order-item.model';
import { Order } from './models/order.model';

@Module({
  imports: [SequelizeModule.forFeature([Order, OrderItem])],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
