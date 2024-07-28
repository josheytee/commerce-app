import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.model';

@Controller('inventories')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() data: Partial<Inventory>): Promise<Inventory> {
    return this.inventoryService.create(data);
  }

  @Get()
  findAll(): Promise<Inventory[]> {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Inventory> {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() data: Partial<Inventory>,
  ): Promise<Inventory> {
    return this.inventoryService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.inventoryService.remove(id);
  }
}
