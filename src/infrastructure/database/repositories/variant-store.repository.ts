import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VariantStoreModel } from 'src/infrastructure';
import { BaseRepository } from './base.repository';

@Injectable()
export class VariantStoreRepository extends BaseRepository<VariantStoreModel> {
    constructor(
        @InjectModel(VariantStoreModel)
        variantStoreModel: typeof VariantStoreModel,
    ) {
        super(variantStoreModel);
    }

}
