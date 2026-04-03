import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryModel } from 'src/infrastructure';
import { InventoryRepository } from 'src/infrastructure/database/repositories';

@Module({
  imports: [SequelizeModule.forFeature([InventoryModel])],
  providers: [InventoryService, InventoryRepository],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule { }
