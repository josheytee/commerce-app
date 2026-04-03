import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
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
    InventoryService,
    InventoryRepository,
    OrderRepository,
    VariantRepository,
  ],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule { }
