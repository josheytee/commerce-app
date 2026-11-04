import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DigitalDeliveryModel } from 'src/infrastructure';
import { BaseRepository } from './base.repository';

@Injectable()
export class DigitalDeliveryRepository extends BaseRepository<DigitalDeliveryModel> {
    constructor(
        @InjectModel(DigitalDeliveryModel)
        model: typeof DigitalDeliveryModel,
    ) {
        super(model);
    }
}
