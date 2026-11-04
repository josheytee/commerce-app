import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ServiceBookingModel } from 'src/infrastructure';
import { BaseRepository } from './base.repository';

@Injectable()
export class ServiceBookingRepository extends BaseRepository<ServiceBookingModel> {
    constructor(
        @InjectModel(ServiceBookingModel)
        model: typeof ServiceBookingModel,
    ) {
        super(model);
    }
}   
