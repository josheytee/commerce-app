import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductModel } from 'src/infrastructure';
import { BaseRepository } from './base.repository';

@Injectable()
export class ProductRepository extends BaseRepository<ProductModel> {
    constructor(
        @InjectModel(ProductModel)
        private productModel: typeof ProductModel,
    ) {
        super(productModel);
    }

    async findByStore(
        storeId: number,
        vendorId: number,
    ): Promise<ProductModel[]> {
        if (!storeId || !vendorId) return [];

        return this.findAll({
            where: { store_id: storeId },
        });
    }

    async findOneByStore(
        storeId: number,
        sectionId: number,
    ): Promise<ProductModel | null> {
        return this.findOne({
            where: { id: sectionId, store_id: storeId },
        });
    }
}
