import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Vendor } from './vendor.model';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Vendor)
    private vendorModel: typeof Vendor,
  ) {}

  async create(data: Partial<Vendor>): Promise<Vendor> {
    return this.vendorModel.create(data);
  }

  async findAll(): Promise<Vendor[]> {
    return this.vendorModel.findAll();
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
