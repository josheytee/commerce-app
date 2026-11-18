import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from './base.repository';
import { OrderItemModel, OrderModel } from '../models';
import { Op, Transaction } from 'sequelize';
import { OrderStatusEnum } from 'src/shared/enums/order.enums';

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

    async countOpenOrderItems(
        variantIds: number[],
        t: Transaction,
    ): Promise<number> {
        return this.orderItemModel.count({
            include: [
                {
                    model: OrderModel,
                    as: 'order',
                    where: {
                        status: {
                            [Op.in]: [
                                // OrderStatusEnum.PENDING_PAYMENT,
                                // OrderStatusEnum.OUT_FOR_DELIVERY,
                                OrderStatusEnum.PROCESSING,
                                // OrderStatusEnum.READY_FOR_PICKUP,
                            ],
                        },
                    },
                },
            ],
            where: {
                variant_id: {
                    [Op.in]: variantIds,
                },
            },
            transaction: t,
        });
    }
}
