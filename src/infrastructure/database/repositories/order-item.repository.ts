import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from './base.repository';
import { OrderItemModel } from '../models';
import { Transaction } from 'sequelize';

@Injectable()
export class OrderItemRepository extends BaseRepository<OrderItemModel> {
    constructor(
        @InjectModel(OrderItemModel)
        private orderItemModel: typeof OrderItemModel,
    ) {
        super(orderItemModel);
    }

    async updateByOrderId(
        orderId: number,
        data: Partial<OrderItemModel>,
        transaction?: Transaction,
    ): Promise<[number, OrderItemModel[]]> {
        return this.orderItemModel.update(data as any, {
            where: { order_id: orderId },
            transaction,
            returning: true,
        });
    }
}

