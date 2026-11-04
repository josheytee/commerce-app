import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderStatusHistoryModel } from '../models';
import { BaseRepository } from './base.repository';

@Injectable()
export class OrderStatusHistoryRepository extends BaseRepository<OrderStatusHistoryModel> {
  constructor(
    @InjectModel(OrderStatusHistoryModel)
    private orderStatusHistoryModel: typeof OrderStatusHistoryModel,
  ) {
    super(orderStatusHistoryModel);
  }
}
