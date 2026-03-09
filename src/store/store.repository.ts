// repositories/Store.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from 'src/database/repositories/base.repository';
import { Store } from './models/store.model';
import { Vendor } from 'src/account/vendor/vendor.model';
import { User } from 'src/account/user/models/user.model';

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
