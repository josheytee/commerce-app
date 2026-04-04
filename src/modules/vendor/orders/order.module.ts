import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

import { PaymentModule } from 'src/infrastructure/payment/payment.module';
import { CustomerModule } from 'src/modules/user/customer/customer.module';
import {
  OrderModel,
  OrderItemModel,
  ProductVariantModel,
  FulfillmentModel,
} from 'src/infrastructure';
import {
  VariantRepository,
  OrderRepository,
  FulfillmentRepository,
} from 'src/infrastructure/database/repositories';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    InventoryModule,
    SequelizeModule.forFeature([
      OrderModel,
      OrderItemModel,
      ProductVariantModel,
      FulfillmentModel,
    ]),
    forwardRef(() => PaymentModule), // Use forwardRef to resolve circular dependency
    forwardRef(() => CustomerModule), // Use forwardRef to resolve circular dependency
  ],
  providers: [
    OrderService,
    OrderRepository,
    VariantRepository,
    FulfillmentRepository,
  ],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule { }
