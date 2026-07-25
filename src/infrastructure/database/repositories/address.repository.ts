import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { AddressModel } from '../models/address.model';
import { CustomerModel } from '../models/customer.model';
import { StoreModel } from '../models/store.model';
import { CityModel } from '../models/city.model';
import { StateModel } from '../models/state.model';
import { CountryModel } from '../models/country.model';
import { AddressableTypeEnum, AddressTypeEnum } from 'src/shared/enums';
import { BaseRepository } from './base.repository';
import { Sequelize } from 'sequelize-typescript';
import {
    AddressNotFoundException,
    CustomerAddressNotFoundException,
    CustomerNotFoundException,
    StoreAddressNotFoundException,
    StoreNotFoundException,
} from 'src/shared';

@Injectable()
export class AddressRepository extends BaseRepository<AddressModel> {
    constructor(
        @InjectModel(AddressModel)
        private readonly addressModel: typeof AddressModel,
        @InjectModel(CustomerModel)
        private readonly customerModel: typeof CustomerModel,
        @InjectModel(StoreModel)
        private readonly storeModel: typeof StoreModel,
        private readonly sequelize: Sequelize,
    ) {
        super(addressModel);
    }

    // ==================== CUSTOMER ADDRESS METHODS ====================

    /**
     * Create address for a customer
     */
    async createCustomerAddress(
        customerId: number,
        addressData: Partial<AddressModel>,
        transaction?: Transaction,
    ): Promise<AddressModel> {
        // Verify customer exists
        const customer = await this.customerModel.findByPk(customerId);
        if (!customer) {
            throw new CustomerNotFoundException(customerId);
        }

        // If this is set as default, remove default from other addresses
        if (addressData.is_default) {
            await this.removeDefaultCustomerAddress(customerId, transaction);
        }

        const address = await this.addressModel.create(
            {
                ...addressData,
                addressable_id: customerId,
                addressable_type: AddressableTypeEnum.CUSTOMER,
            },
            { transaction },
        );

        if (addressData.is_default) {
            await customer.update(
                { default_address_id: address.id },
                { transaction },
            );
        }

        return this.getAddressWithRelations(address.id, transaction);
    }

    /**
     * Get all addresses for a customer
     */
    async getCustomerAddresses(
        customerId: number,
        options?: {
            addressType?: AddressTypeEnum;
            includeDeleted?: boolean;
        },
    ): Promise<AddressModel[]> {
        const where: any = {
            addressable_id: customerId,
            addressable_type: AddressableTypeEnum.CUSTOMER,
        };

        if (options?.addressType) {
            where.address_type = options.addressType;
        }

        const query: any = {
            where,
            include: [
                { model: CityModel, as: 'city' },
                { model: StateModel, as: 'state' },
                { model: CountryModel, as: 'country' },
            ],
            order: [
                ['is_default', 'DESC'],
                ['created_at', 'DESC'],
            ],
        };

        if (options?.includeDeleted) {
            query.paranoid = false;
        }

        return this.addressModel.findAll(query);
    }

    /**
     * Get customer's default address
     */
    async getCustomerDefaultAddress(
        customerId: number,
    ): Promise<AddressModel | null> {
        return this.addressModel.findOne({
            where: {
                addressable_id: customerId,
                addressable_type: AddressableTypeEnum.CUSTOMER,
                is_default: true,
            },
            include: [
                { model: CityModel, as: 'city' },
                { model: StateModel, as: 'state' },
                { model: CountryModel, as: 'country' },
            ],
        });
    }

    /**
     * Remove default flag from all customer addresses
     */
    async removeDefaultCustomerAddress(
        customerId: number,
        transaction?: Transaction,
    ): Promise<void> {
        await this.addressModel.update(
            { is_default: false },
            {
                where: {
                    addressable_id: customerId,
                    addressable_type: AddressableTypeEnum.CUSTOMER,
                },
                transaction,
            },
        );
    }

    /**
     * Set a specific address as default for customer
     */
    async setCustomerDefaultAddress(
        customerId: number,
        addressId: number,
        transaction?: Transaction,
    ): Promise<AddressModel> {
        // Verify address belongs to customer
        const address = await this.addressModel.findOne({
            where: {
                id: addressId,
                addressable_id: customerId,
                addressable_type: AddressableTypeEnum.CUSTOMER,
            },
        });

        if (!address) {
            throw new CustomerAddressNotFoundException(addressId, customerId);
        }

        // Remove default from other addresses
        await this.removeDefaultCustomerAddress(customerId, transaction);

        // Set this address as default
        address.is_default = true;
        await address.save({ transaction });

        return this.getAddressWithRelations(address.id, transaction);
    }

    /**
     * Get customer's billing addresses
     */
    async getCustomerBillingAddresses(
        customerId: number,
    ): Promise<AddressModel[]> {
        return this.addressModel.findAll({
            where: {
                addressable_id: customerId,
                addressable_type: AddressableTypeEnum.CUSTOMER,
                address_type: {
                    [Op.or]: [AddressTypeEnum.BILLING, AddressTypeEnum.BOTH],
                },
            },
            include: [
                { model: CityModel, as: 'city' },
                { model: StateModel, as: 'state' },
                { model: CountryModel, as: 'country' },
            ],
        });
    }

    /**
     * Get customer's shipping addresses
     */
    async getCustomerShippingAddresses(
        customerId: number,
    ): Promise<AddressModel[]> {
        return this.addressModel.findAll({
            where: {
                addressable_id: customerId,
                addressable_type: AddressableTypeEnum.CUSTOMER,
                address_type: {
                    [Op.or]: [AddressTypeEnum.SHIPPING, AddressTypeEnum.BOTH],
                },
            },
            include: [
                { model: CityModel, as: 'city' },
                { model: StateModel, as: 'state' },
                { model: CountryModel, as: 'country' },
            ],
        });
    }

    // ==================== STORE ADDRESS METHODS ====================

    /**
     * Create address for a store
     */
    async createStoreAddress(
        storeId: number,
        addressData: Partial<AddressModel>,
        transaction?: Transaction,
    ): Promise<AddressModel> {
        // Validate store exists
        const store = await this.storeModel.findByPk(storeId, {
            transaction,
            attributes: ['id', 'address_id'], // Only fetch needed fields
        });

        if (!store) {
            throw new StoreNotFoundException(storeId);
        }

        // Validate address data
        this.validateAddressData(addressData);

        // Create the address
        const address = await this.addressModel.create(
            {
                ...addressData,
                addressable_id: storeId,
                addressable_type: AddressableTypeEnum.STORE,
            },
            { transaction },
        );

        // Update store with new address_id
        await store.update({ address_id: address.id }, { transaction });

        // Return the address with relations
        return this.getAddressWithRelations(address.id, transaction);
    }

    /**
     * Validate address data
     */
    private validateAddressData(addressData: Partial<AddressModel>): void {
        const requiredFields = [
            'address_line1',
            'city_id',
            'state_id',
            'country_id',
        ];
        const missingFields = requiredFields.filter((field) => !addressData[field]);

        if (missingFields.length > 0) {
            throw new BadRequestException(
                `Missing required fields: ${missingFields.join(', ')}`,
            );
        }

        // Validate zip code format if provided
        if (addressData.postal_code) {
            const zipCodeRegex = /^[0-9]{5}(-[0-9]{4})?$/; // US zip code format
            if (!zipCodeRegex.test(addressData.postal_code.toString())) {
                throw new BadRequestException('Invalid zip code format');
            }
        }

        // Validate phone number if provided
        if (addressData.contact_phone) {
            const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
            if (!phoneRegex.test(addressData.contact_phone.toString())) {
                throw new BadRequestException('Invalid phone number format');
            }
        }
    }
    /**
     * Get all addresses for a store
     */
    async getStoreAddresses(storeId: number): Promise<AddressModel[]> {
        const where: any = {
            addressable_id: storeId,
            addressable_type: AddressableTypeEnum.STORE,
        };

        const query: any = {
            where,
            include: [
                { model: CityModel, as: 'city', attributes: ['id', 'name'] },
                { model: StateModel, as: 'state', attributes: ['id', 'name'] },
                {
                    model: CountryModel,
                    as: 'country',
                    attributes: ['id', 'name', 'code'],
                },
            ],
            order: [
                ['is_default', 'DESC'],
                ['created_at', 'DESC'],
            ],
        };

        return this.addressModel.findAll(query);
    }

    /**
     * Remove default flag from all store addresses
     */
    async removeDefaultStoreAddress(
        storeId: number,
        transaction?: Transaction,
    ): Promise<void> {
        await this.addressModel.update(
            { is_default: false },
            {
                where: {
                    addressable_id: storeId,
                    addressable_type: AddressableTypeEnum.STORE,
                },
                transaction,
            },
        );
    }

    /**
     * Get store addresses by type (warehouse, retail, etc.)
     */
    async getStoreAddressesByLabel(
        storeId: number,
        label: string,
    ): Promise<AddressModel[]> {
        return this.addressModel.findAll({
            where: {
                addressable_id: storeId,
                addressable_type: AddressableTypeEnum.STORE,
                label: {
                    [Op.iLike]: `%${label}%`,
                },
            },
            include: [
                { model: CityModel, as: 'city' },
                { model: StateModel, as: 'state' },
                { model: CountryModel, as: 'country' },
            ],
        });
    }

    // ==================== COMMON ADDRESS METHODS ====================

    /**
     * Get address with all relations
     */
    async getAddressWithRelations(
        addressId: number,
        transaction?: Transaction,
    ): Promise<AddressModel> {
        const address = await this.addressModel.findByPk(addressId, {
            include: [
                { model: CityModel, as: 'city', attributes: ['id', 'name'] },
                { model: StateModel, as: 'state', attributes: ['id', 'name'] },
                {
                    model: CountryModel,
                    as: 'country',
                    attributes: ['id', 'name', 'code'],
                },
            ],
            transaction,
        });

        if (!address) {
            throw new AddressNotFoundException(addressId);
        }

        return address;
    }

    /**
     * Update address
     */
    async updateAddress(
        addressId: number,
        updateData: Partial<AddressModel>,
        transaction?: Transaction,
    ): Promise<AddressModel> {
        const address = await this.addressModel.findByPk(addressId, {
            transaction,
        });

        if (!address) {
            throw new AddressNotFoundException(addressId);
        }

        // Handle default address changes
        if (updateData.is_default && !address.is_default) {
            if (address.addressable_type === AddressableTypeEnum.CUSTOMER) {
                await this.removeDefaultCustomerAddress(
                    address.addressable_id,
                    transaction,
                );
            } else if (address.addressable_type === AddressableTypeEnum.STORE) {
                await this.removeDefaultStoreAddress(
                    address.addressable_id,
                    transaction,
                );
            }
        }

        await address.update(updateData, { transaction });

        return this.getAddressWithRelations(address.id, transaction);
    }

    /**
     * Delete address (soft delete)
     */
    async deleteAddress(
        addressId: number,
        transaction?: Transaction,
    ): Promise<void> {
        const address = await this.addressModel.findByPk(addressId, {
            transaction,
        });

        if (!address) {
            throw new AddressNotFoundException(addressId);
        }

        // If deleting default address, set another as default
        if (address.is_default) {
            if (address.addressable_type === AddressableTypeEnum.CUSTOMER) {
                const anotherAddress = await this.addressModel.findOne({
                    where: {
                        addressable_id: address.addressable_id,
                        addressable_type: AddressableTypeEnum.CUSTOMER,
                        id: { [Op.ne]: addressId },
                    },
                    order: [['created_at', 'ASC']],
                    transaction,
                });

                if (anotherAddress) {
                    anotherAddress.is_default = true;
                    await anotherAddress.save({ transaction });
                }
            } else if (address.addressable_type === AddressableTypeEnum.STORE) {
                const anotherAddress = await this.addressModel.findOne({
                    where: {
                        addressable_id: address.addressable_id,
                        addressable_type: AddressableTypeEnum.STORE,
                        id: { [Op.ne]: addressId },
                    },
                    order: [['created_at', 'ASC']],
                    transaction,
                });

                if (anotherAddress) {
                    anotherAddress.is_default = true;
                    await anotherAddress.save({ transaction });
                }
            }
        }

        await address.destroy({ transaction });
    }

    /**
     * Get addresses by proximity (within radius)
     */
    async getAddressesByProximity(
        latitude: number,
        longitude: number,
        radiusKm: number,
        options?: {
            addressableType?: AddressableTypeEnum;
            limit?: number;
        },
    ): Promise<AddressModel[]> {
        // This uses the Haversine formula in SQL
        // Note: For production with large datasets, consider using PostGIS
        const query = `
      SELECT *, 
        (6371 * acos(
          cos(radians(:latitude)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians(:longitude)) + 
          sin(radians(:latitude)) * sin(radians(latitude))
        )) AS distance
      FROM addresses
      WHERE latitude IS NOT NULL 
        AND longitude IS NOT NULL
        AND deleted_at IS NULL
        ${options?.addressableType ? 'AND addressable_type = :addressableType' : ''}
      HAVING distance <= :radiusKm
      ORDER BY distance ASC
      LIMIT :limit
    `;

        const replacements: any = {
            latitude,
            longitude,
            radiusKm,
            limit: options?.limit || 50,
        };

        if (options?.addressableType) {
            replacements.addressableType = options.addressableType;
        }

        const addresses = await this.sequelize.query(query, {
            replacements,
            model: this.addressModel,
            mapToModel: true,
        });

        return addresses;
    }

    /**
     * Bulk create addresses
     */
    async bulkCreateAddresses(
        addresses: Partial<AddressModel>[],
        transaction?: Transaction,
    ): Promise<AddressModel[]> {
        const createdAddresses = await this.addressModel.bulkCreate(addresses, {
            transaction,
            returning: true,
        });

        // Load relations for all created addresses
        const addressesWithRelations = await Promise.all(
            createdAddresses.map((addr) =>
                this.getAddressWithRelations(addr.id, transaction),
            ),
        );

        return addressesWithRelations;
    }

    /**
     * Search addresses by text
     */
    async searchAddresses(
        searchTerm: string,
        options?: {
            addressableType?: AddressableTypeEnum;
            limit?: number;
        },
    ): Promise<AddressModel[]> {
        const where: any = {
            [Op.or]: [
                { address_line1: { [Op.iLike]: `%${searchTerm}%` } },
                { address_line2: { [Op.iLike]: `%${searchTerm}%` } },
                { landmark: { [Op.iLike]: `%${searchTerm}%` } },
                { contact_name: { [Op.iLike]: `%${searchTerm}%` } },
                { postal_code: { [Op.iLike]: `%${searchTerm}%` } },
            ],
        };

        if (options?.addressableType) {
            where.addressable_type = options.addressableType;
        }

        return this.addressModel.findAll({
            where,
            include: [
                { model: CityModel, as: 'city' },
                { model: StateModel, as: 'state' },
                { model: CountryModel, as: 'country' },
            ],
            limit: options?.limit || 50,
            order: [['created_at', 'DESC']],
        });
    }

    /**
     * Get address statistics for an entity
     */
    async getAddressStats(
        addressableId: number,
        addressableType: AddressableTypeEnum,
    ): Promise<{
        total: number;
        default: number;
        verified: number;
        byType: Record<AddressTypeEnum, number>;
    }> {
        const addresses = await this.addressModel.findAll({
            where: {
                addressable_id: addressableId,
                addressable_type: addressableType,
            },
            paranoid: false,
        });

        const byType = {} as Record<AddressTypeEnum, number>;
        Object.values(AddressTypeEnum).forEach((type) => {
            byType[type] = addresses.filter(
                (addr) => addr.address_type === type,
            ).length;
        });

        return {
            total: addresses.length,
            default: addresses.filter((addr) => addr.is_default).length,
            verified: addresses.filter((addr) => addr.is_verified).length,
            byType,
        };
    }
}
