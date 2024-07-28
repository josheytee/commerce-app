import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Inventory } from './inventory.model';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';

@Module({
  imports: [SequelizeModule.forFeature([Inventory])],
  providers: [InventoryService],
  controllers: [InventoryController],
})
export class InventoryModule {}
