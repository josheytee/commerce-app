import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductVariantModel } from 'src/infrastructure';
import { BaseRepository } from './base.repository';

@Injectable()
export class VariantRepository extends BaseRepository<ProductVariantModel> {
    constructor(
        @InjectModel(ProductVariantModel)
        private productVariantModel: typeof ProductVariantModel,
    ) {
        super(productVariantModel);
    }

    async findByProductId(productId: number): Promise<ProductVariantModel[]> {
        return this.findAll({
            where: { product_id: productId },
        });
    }

    async findOneByProduct(
        productId: number,
        variantId: number,
    ): Promise<ProductVariantModel | null> {
        return this.findOne({
            where: { id: variantId, product_id: productId },
        });
    }

    async deleteByProductId(
        productId: number,
        variantId?: number,
    ): Promise<number> {
        return this.delete({
            where: { id: variantId, product_id: productId },
        });
    }
}
