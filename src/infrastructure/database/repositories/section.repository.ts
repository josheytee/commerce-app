import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SectionModel } from 'src/infrastructure';
import { BaseRepository } from './base.repository';

@Injectable()
export class SectionRepository extends BaseRepository<SectionModel> {
    constructor(
        @InjectModel(SectionModel)
        private sectionModel: typeof SectionModel,
    ) {
        super(sectionModel);
    }

    async findByStore(
        storeId: number,
        vendorId: number,
    ): Promise<SectionModel[]> {
        if (!storeId || !vendorId) return [];

        return this.findAll({
            where: { store_id: storeId },
        });
    }

    async findOneByStore(
        storeId: number,
        sectionId: number,
    ): Promise<SectionModel | null> {
        return this.findOne({
            where: { id: sectionId, store_id: storeId },
        });
    }
}
