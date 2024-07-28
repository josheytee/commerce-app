import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Store } from './models/store.model';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store)
    private storeModel: typeof Store,
  ) {}

  async create(data: Partial<Store>): Promise<Store> {
    return this.storeModel.create(data);
  }

  async findAll(): Promise<Store[]> {
    return this.storeModel.findAll();
  }

  async findOne(id: number): Promise<Store> {
    const store = await this.storeModel.findByPk(id);
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }

  async update(id: number, data: Partial<Store>): Promise<Store> {
    const store = await this.findOne(id);
    return store.update(data);
  }

  async remove(id: number): Promise<void> {
    const store = await this.findOne(id);
    await store.destroy();
  }
}
