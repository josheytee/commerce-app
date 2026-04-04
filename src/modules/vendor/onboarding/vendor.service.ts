import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediaRepository } from 'src/modules/vendor/media/media.repository';
import { VendorRepository } from './vendor.repository';
import {
  VendorModel,
  MediaModel,
  UserModel,
  CategoryModel,
} from 'src/infrastructure';
import { Sequelize } from 'sequelize-typescript';
import { RoleRepository } from '../../user/role/role.repository';
import { UserVendorRoleRepository } from '../../user/user-vendor-role/user-vendor-role.repository';
import { CreateVendorDto } from './dto';

@Injectable()
export class VendorService {
  constructor(
    private vendorRepository: VendorRepository,
    private roleRepository: RoleRepository,
    private mediaRepository: MediaRepository,
    private userVendorRoleRepository: UserVendorRoleRepository,
    private _sequelize: Sequelize,
  ) { }

  async create(
    createVendorDto: Partial<CreateVendorDto>,
  ): Promise<VendorModel> {
    // Check if vendor already exists
    const transaction = await this._sequelize.transaction();
    try {
      // const existingVendor = await this.vendorRepository.findByUserId(
      //   createVendorDto.user_id,
      // );

      // if (existingVendor.length) {
      //   throw new Error('User already has a vendor account');
      // }
      const vendorData = {
        //   business_name: createVendorDto.business_name,
        //   business_phone: createVendorDto.business_phone,
        //   business_email: createVendorDto.business_email,
        //   business_description: createVendorDto.business_description,
        //   business_short_description: createVendorDto.business_short_description,
        //   business_address: createVendorDto.business_address,
        //   business_website: createVendorDto.business_website,
        //   logo_url: createVendorDto.logo_url,
        //   cover_image_url: createVendorDto.cover_image_url,
        //   rating_average: createVendorDto.rating_average || 0,
        //   total_ratings: createVendorDto.total_ratings || 0,
        //   total_reviews: createVendorDto.total_reviews || 0,
        //   business_hours: createVendorDto.business_hours || {},
        //   social_media: createVendorDto.social_media || {},
        //   business_services: createVendorDto.business_services || [],
        payment_methods: createVendorDto.payment_methods || [],
        //   delivery_options: createVendorDto.delivery_options || [],
        //   status: createVendorDto.status || 'pending',
        //   is_verified: createVendorDto.is_verified || false,
        //   tax_id: createVendorDto.tax_id,
        //   registration_number: createVendorDto.registration_number,
        //   settings: createVendorDto.settings || {},
        //   metadata: createVendorDto.metadata || {},
        //   user_id: createVendorDto.user_id,
        //   category_id: createVendorDto.category_id,
        ...createVendorDto,
      };

      // Remove undefined values
      Object.keys(vendorData).forEach((key) => {
        if (vendorData[key] === undefined) {
          delete vendorData[key];
        }
      });

      console.log('Creating vendor with data:', vendorData);

      const vendor = await this.vendorRepository.createWithTransaction(
        vendorData,
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
      // console.error('Detailed SQL Error:', {
      //   message: error.message,
      //   sql: error.sql,
      //   parameters: error.parameters,
      //   original: error.original,
      // });
      await transaction.rollback();
      throw error;
    }
  }

  async getVendor(id: number): Promise<VendorModel> {
    const vendor = await this.vendorRepository.findWithFullDetails(id);
    if (!vendor) {
      throw new NotFoundException('VendorModel not found');
    }
    return vendor;
  }

  async setAsDefault(userId: number, vendorId: number): Promise<VendorModel> {
    // Check if vendor exists and belongs to user
    const vendor = await this.vendorRepository.findById(vendorId);

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    if (vendor.user_id !== userId) {
      throw new ForbiddenException('You do not own this vendor');
    }

    // If it's already default, just return it
    if (vendor.is_default) {
      return vendor;
    }

    // Set as default
    const updatedVendor = await this.vendorRepository.setAsDefault(
      userId,
      vendorId,
    );

    if (!updatedVendor) {
      throw new Error('Failed to set vendor as default');
    }

    return updatedVendor;
  }

  async getDefaultVendor(userId: number): Promise<VendorModel | null> {
    return this.vendorRepository.getDefaultVendor(userId);
  }

  async findVendorsByUserId(userId: number): Promise<VendorModel[]> {
    const vendors = await this.vendorRepository.findByUserId(userId);
    // if (!vendors) {
    //   throw new NotFoundException('Vendors not found');
    // }
    return vendors;
  }

  async findById(id: number): Promise<VendorModel> {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
      include: [
        { model: MediaModel, as: 'logo' }, // Single logo
        { model: UserModel, as: 'user' },
        { model: CategoryModel, as: 'category' },
      ],
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor; // Returns VendorModel with vendor.logo (single object)
  }

  async update(id: number, data: Partial<VendorModel>): Promise<VendorModel> {
    const [affectedCount, [updatedVendor]] = await this.vendorRepository.update(
      id,
      data,
    );
    if (affectedCount === 0) {
      throw new NotFoundException('VendorModel not found');
    }
    return updatedVendor;
  }

  async delete(id: number): Promise<void> {
    const affectedCount = await this.vendorRepository.delete(id);
    if (affectedCount === 0) {
      throw new NotFoundException('VendorModel not found');
    }
  }

  // Transaction example
  async createVendorWithStores(
    vendorData: Partial<VendorModel>,
    storesData: any[],
  ): Promise<VendorModel> {
    const transaction = await this._sequelize.transaction();

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
  //   await VendorModel.update({ api_key: apiKey }, { where: { id: vendorId } });
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
      throw new NotFoundException('VendorModel not found');
    }

    return {
      totalStores: vendor.stores?.length || 0,
      businessName: vendor.business_name,
    };
  }
}
