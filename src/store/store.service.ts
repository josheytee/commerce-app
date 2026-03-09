import { StoreRepository } from './store.repository';
import { Store } from './models/store.model';
import { VendorRepository } from 'src/account/vendor/vendor.repository';
import { CreateStoreDto } from './dto';
import { Sequelize } from 'sequelize-typescript';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
@Injectable()
export class StoreService {
  constructor(
    private storeRepository: StoreRepository,
    private vendorRepository: VendorRepository,
    private sequelize: Sequelize,
  ) { }

  async create(createStoreDto: Partial<CreateStoreDto>): Promise<Store> {
    // Check if vendor already exists
    const transaction = await this.sequelize.transaction();
    try {
      const store = await this.storeRepository.createWithTransaction(
        {
          vendor_id: createStoreDto.vendor_id,
          name: createStoreDto.name,
          description: createStoreDto.description,
          address_id: createStoreDto.address_id,
        },
        transaction,
      );

      // 4. Commit transaction
      await transaction.commit();

      // 5. Return vendor with relationships
      return this.storeRepository.findById(store.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAllByUserId(id: number): Promise<Store[]> {
    try {
      // Validate input
      if (!id || id <= 0) {
        throw new BadRequestException('Invalid user ID');
      }

      // Direct query through associations
      const stores = await this.storeRepository.findAllByUserId(id)
      console.log(`Found ${stores.length} stores for user ID: ${id}`);

      return stores;
    } catch (error) {
      console.error(`Error finding stores for user ${id}:`, error.message);
      throw new InternalServerErrorException('Failed to retrieve stores');
    }
  }

  async findOne(id: number): Promise<Store> {
    const store = await this.storeRepository.findById(id);
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }

  async update(id: number, data: Partial<Store>): Promise<Store> {
    const [affectedCount, [updatedVendor]] = await this.storeRepository.update(
      id,
      data,
    );
    if (affectedCount === 0) {
      throw new NotFoundException('Store not found');
    }
    return updatedVendor;
  }

  async remove(id: number): Promise<void> {
    const store = await this.findOne(id);
    await store.destroy();
  }
}
