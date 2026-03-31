import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InventoryModel } from 'src/infrastructure';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventoryModel)
    private inventoryModel: typeof InventoryModel,
  ) { }

  async create(data: Partial<InventoryModel>): Promise<InventoryModel> {
    return this.inventoryModel.create(data);
  }

  async findAll(): Promise<InventoryModel[]> {
    return this.inventoryModel.findAll();
  }

  async findOne(id: number): Promise<InventoryModel> {
    const inventory = await this.inventoryModel.findByPk(id);
    if (!inventory) {
      throw new NotFoundException('InventoryModel not found');
    }
    return inventory;
  }

  async update(id: number, data: Partial<InventoryModel>): Promise<InventoryModel> {
    const inventory = await this.findOne(id);
    return inventory.update(data);
  }

  async remove(id: number): Promise<void> {
    const inventory = await this.findOne(id);
    await inventory.destroy();
  }
}
