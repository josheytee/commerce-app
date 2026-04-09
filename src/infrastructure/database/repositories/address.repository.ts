import { Injectable } from '@nestjs/common';
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
     * Set a specific address as default for customer
     */
    async setStoreDefaultAddress(
        storeId: number,
        addressId: number,
        transaction?: Transaction,
    ): Promise<AddressModel> {
        // Verify address belongs to customer
        const address = await this.addressModel.findOne({
            where: {
                id: addressId,
                addressable_id: storeId,
                addressable_type: AddressableTypeEnum.STORE,
            },
        });

        if (!address) {
            throw new StoreAddressNotFoundException(addressId, storeId);
        }

        // Remove default from other addresses
        // await this.removeDefaultCustomerAddress(customerId, transaction);

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
        // Verify store exists
        const store = await this.storeModel.findByPk(storeId);
        if (!store) {
            throw new StoreNotFoundException(storeId);
        }

        // If this is set as default or primary store address
        if (addressData.is_default || addressData.is_primary_store) {
            await this.removeDefaultStoreAddress(storeId, transaction);
            if (addressData.is_primary_store) {
                await this.removePrimaryStoreAddress(storeId, transaction);
            }
        }

        const address = await this.addressModel.create(
            {
                ...addressData,
                addressable_id: storeId,
                addressable_type: AddressableTypeEnum.STORE,
            },
            { transaction },
        );

        return this.getAddressWithRelations(address.id, transaction);
    }

    /**
     * Get all addresses for a store
     */
    async getStoreAddresses(
        storeId: number,
        options?: {
            includeInactive?: boolean;
            onlyPrimary?: boolean;
        },
    ): Promise<AddressModel[]> {
        const where: any = {
            addressable_id: storeId,
            addressable_type: AddressableTypeEnum.STORE,
        };

        if (options?.onlyPrimary) {
            where.is_primary_store = true;
        }

        const query: any = {
            where,
            include: [
                { model: CityModel, as: 'city' },
                { model: StateModel, as: 'state' },
                { model: CountryModel, as: 'country' },
            ],
            order: [
                ['is_primary_store', 'DESC'],
                ['is_default', 'DESC'],
                ['created_at', 'DESC'],
            ],
        };

        if (!options?.includeInactive) {
            query.paranoid = true;
        }

        return this.addressModel.findAll(query);
    }

    /**
     * Get store's primary address
     */
    async getStorePrimaryAddress(storeId: number): Promise<AddressModel | null> {
        return this.addressModel.findOne({
            where: {
                addressable_id: storeId,
                addressable_type: AddressableTypeEnum.STORE,
                is_primary_store: true,
            },
            include: [
                { model: CityModel, as: 'city' },
                { model: StateModel, as: 'state' },
                { model: CountryModel, as: 'country' },
            ],
        });
    }

    /**
     * Get store's default address
     */
    async getStoreDefaultAddress(storeId: number): Promise<AddressModel | null> {
        return this.addressModel.findOne({
            where: {
                addressable_id: storeId,
                addressable_type: AddressableTypeEnum.STORE,
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
     * Remove primary store flag from all store addresses
     */
    async removePrimaryStoreAddress(
        storeId: number,
        transaction?: Transaction,
    ): Promise<void> {
        await this.addressModel.update(
            { is_primary_store: false },
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
     * Set a specific address as primary for store
     */
    async setStorePrimaryAddress(
        storeId: number,
        addressId: number,
        transaction?: Transaction,
    ): Promise<AddressModel> {
        // Verify address belongs to store
        const address = await this.addressModel.findOne({
            where: {
                id: addressId,
                addressable_id: storeId,
                addressable_type: AddressableTypeEnum.STORE,
            },
        });

        if (!address) {
            throw new StoreAddressNotFoundException(addressId, storeId);
        }

        // Remove primary flag from other addresses
        await this.removePrimaryStoreAddress(storeId, transaction);

        // Set this address as primary
        address.is_primary_store = true;
        await address.save({ transaction });

        return this.getAddressWithRelations(address.id, transaction);
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
                { model: CityModel, as: 'city' },
                { model: StateModel, as: 'state' },
                { model: CountryModel, as: 'country' },
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

        // Handle primary store address changes
        if (
            updateData.is_primary_store &&
            !address.is_primary_store &&
            address.addressable_type === AddressableTypeEnum.STORE
        ) {
            await this.removePrimaryStoreAddress(address.addressable_id, transaction);
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
        primaryStore: number;
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
            primaryStore: addresses.filter((addr) => addr.is_primary_store).length,
            verified: addresses.filter((addr) => addr.is_verified).length,
            byType,
        };
    }
}
