import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import {
  OrderModel,
  InventoryModel,
  VariantStoreModel,
  ProductVariantModel,
  InventoryReservationModel,
} from 'src/infrastructure';
import {
  OrderRepository,
  VariantRepository,
  InventoryRepository,
  VariantStoreRepository,
  InventoryReservationRepository,
} from 'src/infrastructure/database/repositories';
import { InventoryReservationService } from './inventory-reservation.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      OrderModel,
      InventoryModel,
      VariantStoreModel,
      ProductVariantModel,
      InventoryReservationModel,
    ]),
  ],
  providers: [
    OrderRepository,
    InventoryService,
    VariantRepository,
    InventoryRepository,
    VariantStoreRepository,
    InventoryReservationService,
    InventoryReservationRepository,
  ],
  controllers: [InventoryController],
  exports: [InventoryService, InventoryReservationService],
})
export class InventoryModule { }
