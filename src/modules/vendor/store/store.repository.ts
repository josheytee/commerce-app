import { Injectable } from '@nestjs/common';
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
}
