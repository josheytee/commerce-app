import { StoreRepository } from './store.repository';
import { CreateStoreDto } from './dto';
import { Sequelize } from 'sequelize-typescript';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { StoreModel } from 'src/infrastructure';
// import { VendorRepository } from '../onboarding/vendor.repository';
@Injectable()
export class StoreService {
  constructor(
    private storeRepository: StoreRepository,
    // private vendorRepository: VendorRepository,
    private sequelize: Sequelize,
  ) { }

  async create(createStoreDto: Partial<CreateStoreDto>): Promise<StoreModel> {
    // Check if vendor already exists
    const transaction = await this.sequelize.transaction();
    try {
      const store = await this.storeRepository.createWithTransaction(
        {
          ...createStoreDto,
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

  async findAllByUserId(id: number): Promise<StoreModel[]> {
    try {
      // Validate input
      if (!id || id <= 0) {
        throw new BadRequestException('Invalid user ID');
      }

      // Direct query through associations
      const stores = await this.storeRepository.findAllByUserId(id);
      console.log(`Found ${stores.length} stores for user ID: ${id}`);

      return stores;
    } catch (error) {
      console.error(`Error finding stores for user ${id}:`, error.message);
      throw new InternalServerErrorException('Failed to retrieve stores');
    }
  }

  async findAllByVendorId(id: number): Promise<StoreModel[]> {
    try {
      // Validate input
      if (!id || id <= 0) {
        throw new BadRequestException('Invalid vendor ID');
      }

      // Direct query through associations
      const stores = await this.storeRepository.findAllByVendorId(id);
      console.log(`Found ${stores.length} stores for vendor ID: ${id}`);

      return stores;
    } catch (error) {
      console.error(`Error finding stores for vendor ${id}:`, error.message);
      throw new InternalServerErrorException('Failed to retrieve stores');
    }
  }

  async findOne(id: number): Promise<StoreModel> {
    const store = await this.storeRepository.findById(id);
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }

  async findOneByVendorId(
    vendorId: number,
    storeId: number,
  ): Promise<StoreModel> {
    const store = await this.storeRepository.findOneByVendorId(
      vendorId,
      storeId,
    );
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }

  async update(id: number, data: Partial<StoreModel>): Promise<StoreModel> {
    const [affectedCount, [updatedVendor]] = await this.storeRepository.update(
      id,
      data,
    );
    if (affectedCount === 0) {
      throw new NotFoundException('Store not found');
    }
    return updatedVendor;
  }

  async updateByVendor(
    vendorId: number,
    storeId: number,
    data: Partial<StoreModel>,
  ): Promise<StoreModel> {
    const store = await this.findOneByVendorId(vendorId, storeId);

    await store.update(data);

    return store;
  }

  async removeByVendorId(vendorId: number, storeId: number): Promise<void> {
    const store = await this.findOneByVendorId(vendorId, storeId);
    await store.destroy();
  }
}
