import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InventoryReservationModel } from '../models';
import { BaseRepository } from './base.repository';

@Injectable()
export class InventoryReservationRepository extends BaseRepository<InventoryReservationModel> {
  constructor(
    @InjectModel(InventoryReservationModel)
    private inventoryReservationModel: typeof InventoryReservationModel,
  ) {
    super(inventoryReservationModel);
  }
}
