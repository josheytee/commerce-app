import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from 'src/infrastructure/database/repositories/base.repository';
import { UserModel, StoreModel, VendorModel } from 'src/infrastructure';

@Injectable()
export class StoreRepository extends BaseRepository<StoreModel> {
    constructor(
        @InjectModel(StoreModel)
        private storeModel: typeof StoreModel,
    ) {
        super(storeModel);
    }

    async findAllByUserId(id: number): Promise<StoreModel[]> {
        // Direct query through associations
        const stores = await StoreModel.findAll({
            include: [
                {
                    model: VendorModel,
                    as: 'vendor',
                    required: true,
                    include: [
                        {
                            model: UserModel,
                            as: 'user',
                            where: { id }, // Filter by user ID directly
                            required: true,
                            attributes: [], // Don't need to return user data
                        },
                    ],
                },
            ],
        });

        return stores;
    }

    async findAllByVendorId(id: number): Promise<StoreModel[]> {
        // Direct query through associations
        const stores = await this.storeModel.findAll({
            include: [
                {
                    model: VendorModel,
                    as: 'vendor',
                    required: true,
                    where: { id },
                    include: [
                        {
                            model: UserModel,
                            as: 'user',
                            required: true,
                            attributes: [], // Don't need to return user data
                        },
                    ],
                },
            ],
        });

        return stores;
    }

    async findOneByVendorId(
        vendorId: number,
        storeId: number,
    ): Promise<StoreModel> {
        // Direct query through associations
        const store = await StoreModel.findOne({
            where: { id: storeId }, // Filter by store ID
            include: [
                {
                    model: VendorModel,
                    as: 'vendor',
                    required: true,
                    where: { id: vendorId }, // Filter by vendor ID
                    include: [
                        {
                            model: UserModel,
                            as: 'user',
                            required: true,
                            attributes: [], // Don't need to return user data
                        },
                    ],
                },
            ],
        });
        return store;
    }
}
