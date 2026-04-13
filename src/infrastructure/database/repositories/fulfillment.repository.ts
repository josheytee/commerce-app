import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from './base.repository';
import { FulfillmentModel } from '../models';
import { FulfillmentStatusEnum } from 'src/shared';

@Injectable()
export class FulfillmentRepository extends BaseRepository<FulfillmentModel> {
    constructor(
        @InjectModel(FulfillmentModel)
        private fulfillmentModel: typeof FulfillmentModel,
    ) {
        super(fulfillmentModel);
    }

    async findPending() {
        return this.model.findAll({
            where: { status: FulfillmentStatusEnum.PENDING },
        });
    }
}
