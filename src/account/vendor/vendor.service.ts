import * as crypto from 'crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VendorRepository } from './vendor.repository';
import { Vendor } from './vendor.model';
import { Sequelize } from 'sequelize-typescript';
import { RoleRepository } from '../role/role.repository';
import { UserVendorRoleRepository } from '../user-vendor-role/user-vendor-role.repository';
import { CreateVendorDto } from './dto';

@Injectable()
export class VendorService {
  constructor(
    private vendorRepository: VendorRepository,
    private roleRepository: RoleRepository,
    private userVendorRoleRepository: UserVendorRoleRepository,
    private sequelize: Sequelize,
  ) { }

  async create(createVendorDto: Partial<CreateVendorDto>): Promise<Vendor> {
    // Check if vendor already exists
    const transaction = await this.sequelize.transaction();
    try {
      const existingVendor = await this.vendorRepository.findByUserId(
        createVendorDto.user_id,
      );

      if (existingVendor.length) {
        throw new Error('User already has a vendor account');
      }

      const vendor = await this.vendorRepository.createWithTransaction(
        {
          user_id: createVendorDto.user_id,
          business_name: createVendorDto.business_name,
          business_phone: createVendorDto.business_phone,
          category_id: createVendorDto.category_id,
        },
        transaction,
      );

      // 3. 🔑 ATTACH OWNER ROLE - This is where it belongs!
      const ownerRole = await this.roleRepository.findById(1);

      if (!ownerRole) {
        throw new BadRequestException(
          'Owner role not found. Please seed roles first.',
        );
      }

      await this.userVendorRoleRepository.createWithTransaction(
        {
          user_id: createVendorDto.user_id,
          vendor_id: vendor.id,
          role_id: ownerRole.id,
        },
        transaction,
      );

      // 4. Commit transaction
      await transaction.commit();

      // 5. Return vendor with relationships
      return this.vendorRepository.findById(vendor.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
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

  // async generateApiKey(vendorId: number): Promise<string> {
  //   const apiKey = crypto.randomBytes(32).toString('hex');
  //   await Vendor.update({ api_key: apiKey }, { where: { id: vendorId } });
  //   return apiKey;
  // }

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
