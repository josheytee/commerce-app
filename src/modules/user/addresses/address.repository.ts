// repositories/address.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction, WhereOptions } from 'sequelize';
import { Address, AddressableType, AddressType } from './address.model';
import { City } from './city/city.model';
import { State } from './state/state.model';
import { Country } from './country/country.model';
import { BaseRepository } from 'src/infrastructure/database/repositories/base.repository';

@Injectable()
export class AddressRepository extends BaseRepository<Address> {
    constructor(
        @InjectModel(Address)
        private addressModel: typeof Address,
    ) {
        super(addressModel);
    }

    // ==================== CREATE OPERATIONS ====================

    async createAddress(
        data: Partial<Address>,
        transaction?: Transaction,
    ): Promise<Address> {
        return this.addressModel.create(data, { transaction });
    }

    async createCustomerAddress(
        customerId: number,
        addressData: Partial<Address>,
        transaction?: Transaction,
    ): Promise<Address> {
        // If this is set as default, unset any existing default
        if (addressData.is_default) {
            await this.unsetDefaultAddress(
                customerId,
                AddressableType.CUSTOMER,
                transaction,
            );
        }

        return this.addressModel.create(
            {
                ...addressData,
                addressable_id: customerId,
                addressable_type: AddressableType.CUSTOMER,
            },
            { transaction },
        );
    }

    async createStoreAddress(
        storeId: number,
        addressData: Partial<Address>,
        transaction?: Transaction,
    ): Promise<Address> {
        // If this is set as primary store, unset any existing primary
        if (addressData.is_primary_store) {
            await this.unsetPrimaryStoreAddress(storeId, transaction);
        }

        // If this is set as default, unset any existing default
        if (addressData.is_default) {
            await this.unsetDefaultAddress(
                storeId,
                AddressableType.STORE,
                transaction,
            );
        }

        return this.addressModel.create(
            {
                ...addressData,
                addressable_id: storeId,
                addressable_type: AddressableType.STORE,
            },
            { transaction },
        );
    }

    // ==================== READ OPERATIONS ====================

    async findByIdScopped(id: number, scope?: string[]): Promise<Address | null> {
        let query: any = this.addressModel;

        if (scope?.length) {
            query = query.scope(scope);
        }

        return query.findByPk(id);
    }

    async findByIdOrFail(id: number, scope?: string[]): Promise<Address> {
        const address = await this.findByIdScopped(id, scope);
        if (!address) {
            throw new NotFoundException(`Address with ID ${id} not found`);
        }
        return address;
    }

    async findAllByCustomer(
        customerId: number,
        options?: {
            addressType?: AddressType;
            isDefault?: boolean;
            includeLocation?: boolean;
            limit?: number;
            offset?: number;
        },
    ): Promise<Address[]> {
        const where: WhereOptions = {
            addressable_id: customerId,
            addressable_type: AddressableType.CUSTOMER,
        };

        if (options?.addressType) {
            where.address_type = options.addressType;
        }

        if (options?.isDefault !== undefined) {
            where.is_default = options.isDefault;
        }

        const query: any = {
            where,
            order: [
                ['is_default', 'DESC'],
                ['created_at', 'DESC'],
            ],
        };

        if (options?.limit) {
            query.limit = options.limit;
            query.offset = options.offset || 0;
        }

        if (options?.includeLocation !== false) {
            query.include = [
                { model: City, as: 'city' },
                { model: State, as: 'state' },
                { model: Country, as: 'country' },
            ];
        }

        return this.addressModel.findAll(query);
    }

    async findAllByStore(
        storeId: number,
        options?: {
            addressType?: AddressType;
            isDefault?: boolean;
            isPrimaryStore?: boolean;
            includeLocation?: boolean;
        },
    ): Promise<Address[]> {
        const where: WhereOptions = {
            addressable_id: storeId,
            addressable_type: AddressableType.STORE,
        };

        if (options?.addressType) {
            where.address_type = options.addressType;
        }

        if (options?.isDefault !== undefined) {
            where.is_default = options.isDefault;
        }

        if (options?.isPrimaryStore !== undefined) {
            where.is_primary_store = options.isPrimaryStore;
        }

        const query: any = {
            where,
            order: [
                ['is_primary_store', 'DESC'],
                ['is_default', 'DESC'],
                ['created_at', 'DESC'],
            ],
        };

        if (options?.includeLocation !== false) {
            query.include = [
                { model: City, as: 'city' },
                { model: State, as: 'state' },
                { model: Country, as: 'country' },
            ];
        }

        return this.addressModel.findAll(query);
    }

    async findCustomerDefaultAddress(
        customerId: number,
    ): Promise<Address | null> {
        return this.addressModel.findOne({
            where: {
                addressable_id: customerId,
                addressable_type: AddressableType.CUSTOMER,
                is_default: true,
            },
            include: [
                { model: City, as: 'city' },
                { model: State, as: 'state' },
                { model: Country, as: 'country' },
            ],
        });
    }

    async findStorePrimaryAddress(storeId: number): Promise<Address | null> {
        return this.addressModel.findOne({
            where: {
                addressable_id: storeId,
                addressable_type: AddressableType.STORE,
                is_primary_store: true,
            },
            include: [
                { model: City, as: 'city' },
                { model: State, as: 'state' },
                { model: Country, as: 'country' },
            ],
        });
    }

    async findNearby(
        latitude: number,
        longitude: number,
        radiusInKm: number = 10,
        entityType?: AddressableType,
    ): Promise<Address[]> {
        // Haversine formula for distance calculation
        const query = `
      SELECT *, 
      (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
      cos(radians(longitude) - radians(?)) + sin(radians(?)) * 
      sin(radians(latitude)))) AS distance 
      FROM addresses 
      WHERE latitude IS NOT NULL 
        AND longitude IS NOT NULL
        AND deleted_at IS NULL
        ${entityType ? 'AND addressable_type = ?' : ''}
      HAVING distance < ?
      ORDER BY distance
      LIMIT 50
    `;

        const replacements: any[] = [latitude, longitude, latitude];
        if (entityType) {
            replacements.push(entityType);
        }
        replacements.push(radiusInKm);

        return this.addressModel.sequelize!.query(query, {
            replacements,
            model: this.addressModel,
            mapToModel: true,
        });
    }

    // ==================== UPDATE OPERATIONS ====================

    async updateAddress(
        id: number,
        data: Partial<Address>,
        transaction?: Transaction,
    ): Promise<Address> {
        const address = await this.findByIdOrFail(id);

        // Handle default address logic
        if (data.is_default && !address.is_default) {
            await this.unsetDefaultAddress(
                address.addressable_id,
                address.addressable_type,
                transaction,
            );
        }

        // Handle primary store logic
        if (data.is_primary_store && !address.is_primary_store) {
            await this.unsetPrimaryStoreAddress(address.addressable_id, transaction);
        }

        await address.update(data, { transaction });
        return address.reload({ transaction });
    }

    async setAsDefault(id: number, transaction?: Transaction): Promise<Address> {
        const address = await this.findByIdOrFail(id);

        await this.unsetDefaultAddress(
            address.addressable_id,
            address.addressable_type,
            transaction,
        );

        address.is_default = true;
        await address.save({ transaction });

        return address;
    }

    async setAsPrimaryStore(
        id: number,
        transaction?: Transaction,
    ): Promise<Address> {
        const address = await this.findByIdOrFail(id);

        if (address.addressable_type !== AddressableType.STORE) {
            throw new Error('Only store addresses can be set as primary');
        }

        await this.unsetPrimaryStoreAddress(address.addressable_id, transaction);

        address.is_primary_store = true;
        await address.save({ transaction });

        return address;
    }

    async verifyAddress(id: number, transaction?: Transaction): Promise<Address> {
        const address = await this.findByIdOrFail(id);
        address.is_verified = true;
        return address.save({ transaction });
    }

    // ==================== DELETE OPERATIONS ====================

    async deleteAddress(id: number, transaction?: Transaction): Promise<void> {
        const address = await this.findByIdOrFail(id);
        await address.destroy({ transaction });
    }

    async deleteAllCustomerAddresses(
        customerId: number,
        transaction?: Transaction,
    ): Promise<number> {
        return this.addressModel.destroy({
            where: {
                addressable_id: customerId,
                addressable_type: AddressableType.CUSTOMER,
            },
            transaction,
        });
    }

    async softDeleteAddress(
        id: number,
        transaction?: Transaction,
    ): Promise<Address> {
        const address = await this.findByIdOrFail(id);
        await address.destroy({ transaction }); // Will soft delete due to paranoid: true
        return address;
    }

    async restoreAddress(
        id: number,
        transaction?: Transaction,
    ): Promise<Address> {
        const address = await this.addressModel.findByPk(id, {
            paranoid: false, // Include soft-deleted
        });

        if (!address) {
            throw new NotFoundException(`Address with ID ${id} not found`);
        }

        await address.restore({ transaction });
        return address;
    }

    // ==================== UTILITY METHODS ====================

    private async unsetDefaultAddress(
        entityId: number,
        entityType: AddressableType,
        transaction?: Transaction,
    ): Promise<void> {
        await this.addressModel.update(
            { is_default: false },
            {
                where: {
                    addressable_id: entityId,
                    addressable_type: entityType,
                    is_default: true,
                },
                transaction,
            },
        );
    }

    private async unsetPrimaryStoreAddress(
        storeId: number,
        transaction?: Transaction,
    ): Promise<void> {
        await this.addressModel.update(
            { is_primary_store: false },
            {
                where: {
                    addressable_id: storeId,
                    addressable_type: AddressableType.STORE,
                    is_primary_store: true,
                },
                transaction,
            },
        );
    }

    async countByCustomer(customerId: number): Promise<number> {
        return this.addressModel.count({
            where: {
                addressable_id: customerId,
                addressable_type: AddressableType.CUSTOMER,
            },
        });
    }

    async findDuplicates(
        addressData: Partial<Address>,
        excludeId?: number,
    ): Promise<Address[]> {
        const where: WhereOptions = {
            address_line1: addressData.address_line1,
            city_id: addressData.city_id,
            state_id: addressData.state_id,
            country_id: addressData.country_id,
            postal_code: addressData.postal_code,
        };

        if (excludeId) {
            where.id = { [Op.ne]: excludeId };
        }

        return this.addressModel.findAll({ where });
    }
}
