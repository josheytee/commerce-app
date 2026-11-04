import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from './base.repository';
import { ProductVariantAttributeValueModel } from '../models';
import { Transaction } from 'sequelize';

@Injectable()
export class ProductVariantAttributeValueRepository extends BaseRepository<ProductVariantAttributeValueModel> {
    constructor(
        @InjectModel(ProductVariantAttributeValueModel)
        private productVariantAttributeValueModel: typeof ProductVariantAttributeValueModel,
    ) {
        super(productVariantAttributeValueModel);
    }


    async bulkAttach(
        rows: {
            variant_id: number;
            attribute_id: number;
            attribute_value_id: number;
        }[],
        t?: Transaction,
    ) {
        return this.model.bulkCreate(rows, {
            transaction: t,
            ignoreDuplicates: true,
        });
    }

    async deleteByVariant(variantId: number, t?: Transaction) {
        return this.model.destroy({
            where: { variant_id: variantId },
            transaction: t,
        });
    }
}
