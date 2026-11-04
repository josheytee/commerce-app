import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CheckoutSessionModel } from 'src/infrastructure';
import { BaseRepository } from './base.repository';

@Injectable()
export class CheckoutSessionRepository extends BaseRepository<CheckoutSessionModel> {
    constructor(
        @InjectModel(CheckoutSessionModel)
        model: typeof CheckoutSessionModel,
    ) {
        super(model);
    }

}
