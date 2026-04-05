import { Injectable } from '@nestjs/common';
import { FulfillmentModel } from 'src/infrastructure/database/models';
import { FulfillmentRepository } from 'src/infrastructure/database/repositories';

@Injectable()
export class FulfillmentService {
    constructor(private readonly _fulfillmentRepository: FulfillmentRepository) { }

    async createFulfillment(data: any): Promise<FulfillmentModel> {
        return this._fulfillmentRepository.create(data);
    }
    async updateStatus(data: any): Promise<FulfillmentModel> {
        return this._fulfillmentRepository.create(data);
    }
}
