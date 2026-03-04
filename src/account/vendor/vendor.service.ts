import * as crypto from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { VendorRepository } from './vendor.repository';
import { Vendor } from './vendor.model';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class VendorService {
  constructor(
    private vendorRepository: VendorRepository,
    private sequelize: Sequelize,
  ) { }

  async create(data: Partial<Vendor>): Promise<Vendor> {
    // Check if vendor already exists
    const existingVendor = await this.vendorRepository.findByUserId(
      data.user_id,
    );
    if (existingVendor) {
      throw new Error('User already has a vendor account');
    }

    return this.vendorRepository.create(data);
  }

  async getVendor(id: number): Promise<Vendor> {
    const vendor = await this.vendorRepository.findWithFullDetails(id);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async findVendorsByUserId(userId: number): Promise<Vendor[]> {
    const vendors = await this.vendorRepository.findByUserId(userId);
    if (!vendors) {
      throw new NotFoundException('Vendors not found');
    }
    return vendors;
  }
  async findOne(id: number): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
    });
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async update(id: number, data: Partial<Vendor>): Promise<Vendor> {
    const [affectedCount, [updatedVendor]] = await this.vendorRepository.update(
      id,
      data,
    );
    if (affectedCount === 0) {
      throw new NotFoundException('Vendor not found');
    }
    return updatedVendor;
  }

  async delete(id: number): Promise<void> {
    const affectedCount = await this.vendorRepository.delete(id);
    if (affectedCount === 0) {
      throw new NotFoundException('Vendor not found');
    }
  }

  // Transaction example
  async createVendorWithStores(
    vendorData: Partial<Vendor>,
    storesData: any[],
  ): Promise<Vendor> {
    const transaction = await this.sequelize.transaction();

    try {
      // Create vendor within transaction
      const vendor = await this.vendorRepository.createWithTransaction(
        vendorData,
        transaction,
      );

      // Create stores (you'd have a store repository)
      // await this.storeRepository.createWithTransaction(...);

      await transaction.commit();
      return vendor;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async generateApiKey(vendorId: number): Promise<string> {
    const apiKey = crypto.randomBytes(32).toString('hex');
    await Vendor.update({ api_key: apiKey }, { where: { id: vendorId } });
    return apiKey;
  }

  async getVendorStats(id: number): Promise<any> {
    const vendor = await this.vendorRepository.findById(id, {
      include: [
        {
          association: 'stores',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return {
      totalStores: vendor.stores?.length || 0,
      businessName: vendor.business_name,
    };
  }
}
