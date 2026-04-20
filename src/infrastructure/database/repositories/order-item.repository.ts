import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from './base.repository';
import { OrderItemModel } from '../models';

@Injectable()
export class OrderItemRepository extends BaseRepository<OrderItemModel> {
    constructor(
        @InjectModel(OrderItemModel)
        private orderItemModel: typeof OrderItemModel,
    ) {
        super(orderItemModel);
    }
}
