import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from './base.repository';
import { FulfillmentItemModel } from '../models';

@Injectable()
export class FulfillmentItemRepository extends BaseRepository<FulfillmentItemModel> {
    constructor(
        @InjectModel(FulfillmentItemModel)
        private fulfillmentItemModel: typeof FulfillmentItemModel,
    ) {
        super(fulfillmentItemModel);
    }

}
