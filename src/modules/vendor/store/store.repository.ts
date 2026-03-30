import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from 'src/infrastructure/database/repositories/base.repository';
import { Store } from './models/store.model';
import { Vendor } from '../onboarding/vendor.model';
import { User } from 'src/modules/user/user/models/user.model';


@Injectable()
export class StoreRepository extends BaseRepository<Store> {
    constructor(
        @InjectModel(Store)
        private storeModel: typeof Store,
    ) {
        super(storeModel);
    }

    async findAllByUserId(id: number): Promise<Store[]> {
        // Direct query through associations
        const stores = await Store.findAll({
            include: [
                {
                    model: Vendor,
                    as: 'vendor',
                    required: true,
                    include: [
                        {
                            model: User,
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
