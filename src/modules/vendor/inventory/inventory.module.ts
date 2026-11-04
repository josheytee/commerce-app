import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import {
  InventoryModel,
  OrderModel,
  ProductVariantModel,
  VariantStoreModel,
} from 'src/infrastructure';
import {
  InventoryRepository,
  OrderRepository,
  VariantRepository,
  VariantStoreRepository,
} from 'src/infrastructure/database/repositories';

@Module({
  imports: [
    SequelizeModule.forFeature([
      InventoryModel,
      OrderModel,
      ProductVariantModel,
      VariantStoreModel,
    ]),
  ],
  providers: [
    InventoryService,
    InventoryRepository,
    OrderRepository,
    VariantRepository,
    VariantStoreRepository,
  ],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule { }
