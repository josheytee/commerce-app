import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InventoryModel } from 'src/infrastructure';
import { BaseRepository } from './base.repository';

@Injectable()
export class InventoryRepository extends BaseRepository<InventoryModel> {
    constructor(
        @InjectModel(InventoryModel)
        private productModel: typeof InventoryModel,
    ) {
        super(productModel);
    }

}
