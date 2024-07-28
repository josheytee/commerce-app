import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Inventory } from './inventory.model';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory)
    private inventoryModel: typeof Inventory,
  ) {}

  async create(data: Partial<Inventory>): Promise<Inventory> {
    return this.inventoryModel.create(data);
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryModel.findAll();
  }

  async findOne(id: number): Promise<Inventory> {
    const inventory = await this.inventoryModel.findByPk(id);
    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }
    return inventory;
  }

  async update(id: number, data: Partial<Inventory>): Promise<Inventory> {
    const inventory = await this.findOne(id);
    return inventory.update(data);
  }

  async remove(id: number): Promise<void> {
    const inventory = await this.findOne(id);
    await inventory.destroy();
  }
}
