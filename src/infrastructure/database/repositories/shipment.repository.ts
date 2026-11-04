import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from './base.repository';
import { ShipmentModel } from '../models';
import { Transaction } from 'sequelize';

@Injectable()
export class ShipmentRepository extends BaseRepository<ShipmentModel> {
    constructor(
        @InjectModel(ShipmentModel)
        private shipmentModel: typeof ShipmentModel,
    ) {
        super(shipmentModel);
    }

    async updateByOrderId(
        orderId: number,
        data: Partial<ShipmentModel>,
        transaction?: Transaction,
    ): Promise<[number, ShipmentModel[]]> {
        return this.shipmentModel.update(data as any, {
            where: { order_id: orderId },
            transaction,
            returning: true,
        });
    }
}

