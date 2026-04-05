import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import {
  InventoryModel,
  OrderModel,
  ProductVariantModel,
} from 'src/infrastructure';
import {
  InventoryRepository,
  OrderRepository,
  VariantRepository,
} from 'src/infrastructure/database/repositories';

@Module({
  imports: [
    SequelizeModule.forFeature([
      InventoryModel,
      OrderModel,
      ProductVariantModel,
    ]),
  ],
  providers: [
    DeliveryService,
    InventoryRepository,
    OrderRepository,
    VariantRepository,
  ],
  controllers: [DeliveryController],
  exports: [DeliveryService],
})
export class DeliveryModule { }
