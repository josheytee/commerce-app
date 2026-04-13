import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RiderModel } from 'src/infrastructure';
import { BaseRepository } from './base.repository';
import { RiderStatusEnum } from 'src/shared';

@Injectable()
export class RiderRepository extends BaseRepository<RiderModel> {
    constructor(
        @InjectModel(RiderModel)
        model: typeof RiderModel,
    ) {
        super(model);
    }

    async findAvailable() {
        return this.model.findAll({
            where: { status: RiderStatusEnum.AVAILABLE },
        });
    }
}
