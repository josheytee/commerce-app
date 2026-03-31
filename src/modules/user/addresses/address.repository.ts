// repositories/address.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction, WhereOptions } from 'sequelize';
import { BaseRepository } from 'src/infrastructure/database/repositories/base.repository';
import {
    CityModel,
    CountryModel,
    StateModel,
    AddressModel,
} from 'src/infrastructure';
import { AddressableTypeEnum, AddressTypeEnum } from 'src/shared';

@Injectable()
export class AddressRepository extends BaseRepository<AddressModel> {
    constructor(
        @InjectModel(AddressModel)
        private addressModel: typeof AddressModel,
    ) {
        super(addressModel);
    }

    // ==================== CREATE OPERATIONS ====================

    async createAddress(
        data: Partial<AddressModel>,
        transaction?: Transaction,
    ): Promise<AddressModel> {
        return this.addressModel.create(data, { transaction });
    }

    async createCustomerAddress(
        customerId: number,
        addressData: Partial<AddressModel>,
        transaction?: Transaction,
    ): Promise<AddressModel> {
        // If this is set as default, unset any existing default
        if (addressData.is_default) {
            await this.unsetDefaultAddress(
                customerId,
                AddressableTypeEnum.CUSTOMER,
                transaction,
            );
        }

        return this.addressModel.create(
            {
                ...addressData,
                addressable_id: customerId,
                addressable_type: AddressableTypeEnum.CUSTOMER,
            },
            { transaction },
        );
    }

    async createStoreAddress(
        storeId: number,
        addressData: Partial<AddressModel>,
        transaction?: Transaction,
    ): Promise<AddressModel> {
        // If this is set as primary store, unset any existing primary
        if (addressData.is_primary_store) {
            await this.unsetPrimaryStoreAddress(storeId, transaction);
        }

        // If this is set as default, unset any existing default
        if (addressData.is_default) {
            await this.unsetDefaultAddress(
                storeId,
                AddressableTypeEnum.STORE,
                transaction,
            );
        }

        return this.addressModel.create(
            {
                ...addressData,
                addressable_id: storeId,
                addressable_type: AddressableTypeEnum.STORE,
            },
            { transaction },
        );
    }

    // ==================== READ OPERATIONS ====================

    async findByIdScopped(
        id: number,
        scope?: string[],
    ): Promise<AddressModel | null> {
        let query: any = this.addressModel;

        if (scope?.length) {
            query = query.scope(scope);
        }

        return query.findByPk(id);
    }

    async findByIdOrFail(id: number, scope?: string[]): Promise<AddressModel> {
        const address = await this.findByIdScopped(id, scope);
        if (!address) {
            throw new NotFoundException(`AddressModel with ID ${id} not found`);
        }
        return address;
    }

    async findAllByCustomer(
        customerId: number,
        options?: {
            addressType?: AddressTypeEnum;
            isDefault?: boolean;
            includeLocation?: boolean;
            limit?: number;
            offset?: number;
        },
    ): Promise<AddressModel[]> {
        const where: WhereOptions = {
            addressable_id: customerId,
            addressable_type: AddressableTypeEnum.CUSTOMER,
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
                { model: CityModel, as: 'city' },
                { model: StateModel, as: 'state' },
                { model: CountryModel, as: 'country' },
            ];
        }

        return this.addressModel.findAll(query);
    }

    async findAllByStore(
        storeId: number,
        options?: {
            addressType?: AddressTypeEnum;
            isDefault?: boolean;
            isPrimaryStore?: boolean;
            includeLocation?: boolean;
        },
    ): Promise<AddressModel[]> {
        const where: WhereOptions = {
            addressable_id: storeId,
            addressable_type: AddressableTypeEnum.STORE,
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
                { model: CityModel, as: 'city' },
                { model: StateModel, as: 'state' },
                { model: CountryModel, as: 'country' },
            ];
        }

        return this.addressModel.findAll(query);
    }

    async findCustomerDefaultAddress(
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

    async findStorePrimaryAddress(storeId: number): Promise<AddressModel | null> {
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

    async findNearby(
        latitude: number,
        longitude: number,
        radiusInKm: number = 10,
        entityType?: AddressableTypeEnum,
    ): Promise<AddressModel[]> {
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
        data: Partial<AddressModel>,
        transaction?: Transaction,
    ): Promise<AddressModel> {
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

    async setAsDefault(
        id: number,
        transaction?: Transaction,
    ): Promise<AddressModel> {
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
    ): Promise<AddressModel> {
        const address = await this.findByIdOrFail(id);

        if (address.addressable_type !== AddressableTypeEnum.STORE) {
            throw new Error('Only store addresses can be set as primary');
        }

        await this.unsetPrimaryStoreAddress(address.addressable_id, transaction);

        address.is_primary_store = true;
        await address.save({ transaction });

        return address;
    }

    async verifyAddress(
        id: number,
        transaction?: Transaction,
    ): Promise<AddressModel> {
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
                addressable_type: AddressableTypeEnum.CUSTOMER,
            },
            transaction,
        });
    }

    async softDeleteAddress(
        id: number,
        transaction?: Transaction,
    ): Promise<AddressModel> {
        const address = await this.findByIdOrFail(id);
        await address.destroy({ transaction }); // Will soft delete due to paranoid: true
        return address;
    }

    async restoreAddress(
        id: number,
        transaction?: Transaction,
    ): Promise<AddressModel> {
        const address = await this.addressModel.findByPk(id, {
            paranoid: false, // Include soft-deleted
        });

        if (!address) {
            throw new NotFoundException(`AddressModel with ID ${id} not found`);
        }

        await address.restore({ transaction });
        return address;
    }

    // ==================== UTILITY METHODS ====================

    private async unsetDefaultAddress(
        entityId: number,
        entityType: AddressableTypeEnum,
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
                    addressable_type: AddressableTypeEnum.STORE,
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
                addressable_type: AddressableTypeEnum.CUSTOMER,
            },
        });
    }

    async findDuplicates(
        addressData: Partial<AddressModel>,
        excludeId?: number,
    ): Promise<AddressModel[]> {
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
