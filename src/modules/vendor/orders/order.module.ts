import { MediaRepository } from './../media/media.repository';
import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderService } from './order.service';
import { PaymentModule } from 'src/infrastructure/payment/payment.module';
import { CustomerModule } from 'src/modules/user/customer/customer.module';
import {
  OrderModel,
  OrderItemModel,
  ProductVariantModel,
  FulfillmentModel,
  VendorModel,
  MediaModel,
} from 'src/infrastructure';
import {
  VariantRepository,
  OrderRepository,
  OrderItemRepository,
  FulfillmentRepository,
} from 'src/infrastructure/database/repositories';
import { InventoryModule } from '../inventory/inventory.module';
import { CustomerOrderController, OrderController } from './controllers';
import { CartModule } from 'src/modules/storefront/cart/cart.module';
import { VendorRepository } from '../onboarding/vendor.repository';

@Module({
  imports: [
    forwardRef(() => CartModule),
    forwardRef(() => InventoryModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => CustomerModule),
    SequelizeModule.forFeature([
      MediaModel,
      OrderModel,
      VendorModel,
      OrderItemModel,
      ProductVariantModel,
      FulfillmentModel,
    ]),
  ],
  providers: [
    MediaRepository,
    OrderService,
    OrderRepository,
    OrderItemRepository,
    VariantRepository,
    VendorRepository,
    FulfillmentRepository,
  ],
  controllers: [OrderController, CustomerOrderController],
  exports: [OrderService, OrderItemRepository, OrderRepository],
})
export class OrderModule { }
