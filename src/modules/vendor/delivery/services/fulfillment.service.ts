import { Injectable } from '@nestjs/common';
import { FulfillmentModel } from 'src/infrastructure/database/models';
import { FulfillmentRepository } from 'src/infrastructure/database/repositories';
import { FulfillmentStatusEnum } from 'src/shared';

@Injectable()
export class FulfillmentService {
    constructor(private readonly _fulfillmentRepository: FulfillmentRepository) { }

    async createFulfillment(data: any): Promise<FulfillmentModel> {
        return this._fulfillmentRepository.create(data);
    }
    async updateStatus(data: any): Promise<FulfillmentModel> {
        return this._fulfillmentRepository.create(data);
    }

    async createFromOrder(order) {
        // group by store
        const groups = this.groupByStore(order.items);

        const fulfillments = [];

        for (const storeId in groups) {
            fulfillments.push(
                await this._fulfillmentRepository.create({
                    order_id: order.id,
                    store_id: Number(storeId),
                    status: FulfillmentStatusEnum.PENDING,
                }),
            );
        }

        return fulfillments;
    }

    private groupByStore(items) {
        return items.reduce((acc, item) => {
            acc[item.store_id] = acc[item.store_id] || [];
            acc[item.store_id].push(item);
            return acc;
        }, {});
    }
}
