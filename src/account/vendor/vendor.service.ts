import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Vendor } from './vendor.model';
import * as crypto from 'crypto';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Vendor)
    private vendorModel: typeof Vendor,
  ) {}

  async create(data: Partial<Vendor>): Promise<Vendor> {
    return this.vendorModel.create(data);
  }

  async findVendorsByUserId(user_id: number): Promise<Vendor[]> {
    return this.vendorModel.findAll({
      where: {
        user_id,
      },
    });
  }

  async findAll(): Promise<Vendor[]> {
    return this.vendorModel.findAll();
  }
  // Method to find vendor by API key
  async findByPublicKey(apiKey: string): Promise<Vendor | null> {
    return Vendor.findOne({ where: { api_key: apiKey } });
  }

  // Method to generate a unique API key
  async generateApiKey(vendorId: number): Promise<string> {
    const apiKey = crypto.randomBytes(32).toString('hex');
    await Vendor.update({ api_key: apiKey }, { where: { id: vendorId } });
    return apiKey;
  }
  async findOne(id: number): Promise<Vendor> {
    const vendor = await this.vendorModel.findByPk(id);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async update(id: number, data: Partial<Vendor>): Promise<Vendor> {
    const [numberOfAffectedRows] = await this.vendorModel.update(data, {
      where: { id },
    });

    if (numberOfAffectedRows === 0) {
      return null; // No rows affected
    }

    return this.vendorModel.findByPk(id);
  }

  async remove(id: number): Promise<void> {
    const vendor = await this.findOne(id);
    await vendor.destroy();
  }
}
