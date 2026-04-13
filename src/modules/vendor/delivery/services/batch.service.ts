import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DeliveryBatchModel } from 'src/infrastructure/database/models/delivery-batches.model';
import { FulfillmentRepository } from 'src/infrastructure/database/repositories';

@Injectable()
export class BatchService {
    constructor(
        private _fulfillmentRepo: FulfillmentRepository,
        @InjectModel(DeliveryBatchModel)
        private batchModel: typeof DeliveryBatchModel,
    ) { }

    async createBatch(fulfillments) {
        const batch = await this.batchModel.create({
            status: 'pending',
        });

        for (const f of fulfillments) {
            await f.update({ batch_id: batch.id });
        }

        return batch;
    }
}
