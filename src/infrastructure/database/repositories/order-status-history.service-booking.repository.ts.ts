import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderStatusHistoryModel } from 'src/infrastructure';
import { BaseRepository } from './base.repository';

@Injectable()
export class OrderStatusHistoryRepository extends BaseRepository<OrderStatusHistoryModel> {
    constructor(
        @InjectModel(OrderStatusHistoryModel)
        model: typeof OrderStatusHistoryModel,
    ) {
        super(model);
    }
}
