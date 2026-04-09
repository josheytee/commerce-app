import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { AddressRepository } from 'src/infrastructure/database/repositories/address.repository';
import { CreateAddressDto, UpdateAddressDto, AddressQueryDto } from './dto';
import { AddressableTypeEnum, AddressTypeEnum } from 'src/shared/enums';
import { AddressModel } from 'src/infrastructure/database/models/address.model';

@Injectable()
export class AddressService {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly sequelize: Sequelize,
  ) { }

  // ==================== CREATE ADDRESS ====================

  async createAddress(
    createAddressDto: CreateAddressDto,
    transaction?: Transaction,
  ): Promise<AddressModel> {
    const { addressable_type, addressable_id, ...addressData } =
      createAddressDto;

    // Validate coordinates if provided
    if (addressData.latitude && addressData.longitude) {
      this.validateCoordinates(addressData.latitude, addressData.longitude);
    }

    let result: AddressModel;

    if (addressable_type === AddressableTypeEnum.CUSTOMER) {
      result = await this.addressRepository.createCustomerAddress(
        addressable_id,
        addressData,
        transaction,
      );
    } else if (addressable_type === AddressableTypeEnum.STORE) {
      result = await this.addressRepository.createStoreAddress(
        addressable_id,
        addressData,
        transaction,
      );
    } else {
      throw new BadRequestException(
        `Invalid addressable type: ${addressable_type}`,
      );
    }

    return result;
  }

  // ==================== GET ADDRESSES ====================

  async findAll(query: AddressQueryDto): Promise<{
    data: AddressModel[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, ...filters } = query;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (filters.addressable_id) {
      where.addressable_id = filters.addressable_id;
    }
    if (filters.addressable_type) {
      where.addressable_type = filters.addressable_type;
    }
    if (filters.address_type) {
      where.address_type = filters.address_type;
    }
    if (filters.city_id) {
      where.city_id = filters.city_id;
    }
    if (filters.state_id) {
      where.state_id = filters.state_id;
    }
    if (filters.country_id) {
      where.country_id = filters.country_id;
    }
    if (filters.is_default !== undefined) {
      where.is_default = filters.is_default;
    }
    if (filters.is_verified !== undefined) {
      where.is_verified = filters.is_verified;
    }

    const { rows, count } = await this.addressRepository.findAndCountAll({
      where,
      include: ['city', 'state', 'country'],
      limit,
      offset,
      order: [[filters.sort_by || 'created_at', filters.sort_order || 'DESC']],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getAddressesByEntity(
    entityType: AddressableTypeEnum,
    entityId: number,
    options?: {
      addressType?: AddressTypeEnum;
      includeDeleted?: boolean;
    },
  ): Promise<AddressModel[]> {
    if (entityType === AddressableTypeEnum.CUSTOMER) {
      return this.addressRepository.getCustomerAddresses(entityId, options);
    } else if (entityType === AddressableTypeEnum.STORE) {
      // return this.addressRepository.getStoreAddresses(entityId, options);
    } else {
      throw new BadRequestException(`Invalid entity type: ${entityType}`);
    }
  }

  async getDefaultAddress(
    entityType: AddressableTypeEnum,
    entityId: number,
  ): Promise<AddressModel | null> {
    if (entityType === AddressableTypeEnum.CUSTOMER) {
      return this.addressRepository.getCustomerDefaultAddress(entityId);
    } else if (entityType === AddressableTypeEnum.STORE) {
      return this.addressRepository.getStoreDefaultAddress(entityId);
    } else {
      throw new BadRequestException(`Invalid entity type: ${entityType}`);
    }
  }

  async getPrimaryStoreAddress(storeId: number): Promise<AddressModel | null> {
    return this.addressRepository.getStorePrimaryAddress(storeId);
  }

  async getCustomerBillingAddresses(
    customerId: number,
  ): Promise<AddressModel[]> {
    return this.addressRepository.getCustomerBillingAddresses(customerId);
  }

  async getCustomerShippingAddresses(
    customerId: number,
  ): Promise<AddressModel[]> {
    return this.addressRepository.getCustomerShippingAddresses(customerId);
  }

  async getAddressById(id: number): Promise<AddressModel> {
    const address = await this.addressRepository.getAddressWithRelations(id);
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
    return address;
  }

  // ==================== UPDATE ADDRESS ====================

  async updateAddress(
    id: number,
    updateAddressDto: UpdateAddressDto,
    transaction?: Transaction,
  ): Promise<AddressModel> {
    const address = await this.getAddressById(id);

    // Validate coordinates if provided
    if (updateAddressDto.latitude && updateAddressDto.longitude) {
      this.validateCoordinates(
        updateAddressDto.latitude,
        updateAddressDto.longitude,
      );
    }

    // Don't allow changing addressable_type or addressable_id
    delete updateAddressDto.addressable_type;
    delete updateAddressDto.addressable_id;

    const updatedAddress = await this.addressRepository.updateAddress(
      id,
      updateAddressDto,
      transaction,
    );

    return updatedAddress;
  }

  async setDefaultAddress(
    entityType: AddressableTypeEnum,
    entityId: number,
    addressId: number,
  ): Promise<AddressModel> {
    const transaction = await this.sequelize.transaction();

    try {
      let result: AddressModel;

      if (entityType === AddressableTypeEnum.CUSTOMER) {
        result = await this.addressRepository.setCustomerDefaultAddress(
          entityId,
          addressId,
          transaction,
        );
      } else if (entityType === AddressableTypeEnum.STORE) {
        result = await this.addressRepository.setStoreDefaultAddress(
          entityId,
          addressId,
          transaction,
        );
      } else {
        throw new BadRequestException(`Invalid entity type: ${entityType}`);
      }

      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async setPrimaryStoreAddress(
    storeId: number,
    addressId: number,
  ): Promise<AddressModel> {
    const transaction = await this.sequelize.transaction();

    try {
      const result = await this.addressRepository.setStorePrimaryAddress(
        storeId,
        addressId,
        transaction,
      );
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async verifyAddress(
    id: number,
    isVerified: boolean = true,
  ): Promise<AddressModel> {
    const address = await this.getAddressById(id);
    return this.addressRepository.updateAddress(id, {
      is_verified: isVerified,
    });
  }

  // ==================== DELETE ADDRESS ====================

  async deleteAddress(
    id: number,
  ): Promise<{ message: string; success: boolean }> {
    const address = await this.getAddressById(id);

    const transaction = await this.sequelize.transaction();

    try {
      await this.addressRepository.deleteAddress(id, transaction);
      await transaction.commit();

      return {
        message: `Address with ID ${id} deleted successfully`,
        success: true,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteAddressesByEntity(
    entityType: AddressableTypeEnum,
    entityId: number,
  ): Promise<{ message: string; count: number }> {
    const transaction = await this.sequelize.transaction();

    try {
      let addresses: AddressModel[];

      if (entityType === AddressableTypeEnum.CUSTOMER) {
        addresses = await this.addressRepository.getCustomerAddresses(entityId);
      } else if (entityType === AddressableTypeEnum.STORE) {
        addresses = await this.addressRepository.getStoreAddresses(entityId);
      } else {
        throw new BadRequestException(`Invalid entity type: ${entityType}`);
      }

      let count = 0;
      for (const address of addresses) {
        await this.addressRepository.deleteAddress(address.id, transaction);
        count++;
      }

      await transaction.commit();

      return {
        message: `${count} address(es) deleted successfully for ${entityType} with ID ${entityId}`,
        count,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ==================== BULK OPERATIONS ====================

  async bulkCreateAddresses(
    addresses: CreateAddressDto[],
  ): Promise<AddressModel[]> {
    const transaction = await this.sequelize.transaction();

    try {
      const results: AddressModel[] = [];

      for (const addressDto of addresses) {
        const address = await this.createAddress(addressDto, transaction);
        results.push(address);
      }

      await transaction.commit();
      return results;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ==================== SEARCH & PROXIMITY ====================

  async searchAddresses(
    searchTerm: string,
    entityType?: AddressableTypeEnum,
    limit: number = 20,
  ): Promise<AddressModel[]> {
    if (!searchTerm || searchTerm.length < 2) {
      throw new BadRequestException(
        'Search term must be at least 2 characters',
      );
    }

    return this.addressRepository.searchAddresses(searchTerm, {
      addressableType: entityType,
      limit,
    });
  }

  async findNearbyAddresses(
    latitude: number,
    longitude: number,
    radiusKm: number,
    entityType?: AddressableTypeEnum,
    limit: number = 50,
  ): Promise<AddressModel[]> {
    this.validateCoordinates(latitude, longitude);

    if (radiusKm <= 0) {
      throw new BadRequestException('Radius must be greater than 0');
    }

    return this.addressRepository.getAddressesByProximity(
      latitude,
      longitude,
      radiusKm,
      {
        addressableType: entityType,
        limit,
      },
    );
  }

  async getAddressStats(entityType: AddressableTypeEnum, entityId: number) {
    return this.addressRepository.getAddressStats(entityId, entityType);
  }

  // ==================== HELPER METHODS ====================

  private validateCoordinates(latitude: number, longitude: number): void {
    if (latitude < -90 || latitude > 90) {
      throw new BadRequestException('Latitude must be between -90 and 90');
    }
    if (longitude < -180 || longitude > 180) {
      throw new BadRequestException('Longitude must be between -180 and 180');
    }
  }
  // Add to AddressService
  async verifyAddressOwnership(
    addressId: number,
    expectedType: AddressableTypeEnum,
    expectedId: number,
  ): Promise<void> {
    const address = await this.getAddressById(addressId);

    if (address.addressable_type !== expectedType) {
      throw new BadRequestException(
        `Address ${addressId} is not a ${expectedType} address`,
      );
    }

    if (address.addressable_id !== expectedId) {
      throw new BadRequestException(
        `Address ${addressId} does not belong to ${expectedType} ${expectedId}`,
      );
    }
  }

  async getStoreAddressesByLabel(
    storeId: number,
    label: string,
  ): Promise<AddressModel[]> {
    return this.addressRepository.getStoreAddressesByLabel(storeId, label);
  }
}
