import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from './base.repository';
import { StoreModel } from '../models';

@Injectable()
export class StoreRepository extends BaseRepository<StoreModel> {
    constructor(
        @InjectModel(StoreModel)
        private storeModel: typeof StoreModel,
    ) {
        super(storeModel);
    }
}
