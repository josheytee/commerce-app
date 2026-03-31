import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryModel } from 'src/infrastructure';

@Module({
  imports: [SequelizeModule.forFeature([InventoryModel])],
  providers: [InventoryService],
  controllers: [InventoryController],
})
export class InventoryModule { }
