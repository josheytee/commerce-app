import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ShipmentEventModel } from '../models';
import { BaseRepository } from './base.repository';

@Injectable()
export class ShipmentEventRepository extends BaseRepository<ShipmentEventModel> {
  constructor(
    @InjectModel(ShipmentEventModel)
    private shipmentEventModel: typeof ShipmentEventModel,
  ) {
    super(shipmentEventModel);
  }
}
