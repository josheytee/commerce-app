import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductVariantModel } from 'src/infrastructure';
import { BaseRepository } from './base.repository';
import { Op, Transaction } from 'sequelize';

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


    /**
     * Update a variant by id. Returns the updated instance (or null if not found).
     */
    // async update(
    //     id: number,
    //     data: Partial<ProductVariantModel>,
    //     t?: Transaction,
    // ): Promise<ProductVariantModel | null> {
    //     const variant = await this.model.findByPk(id, { transaction: t });
    //     if (!variant) return null;
    //     return variant.update(data, { transaction: t });
    // }

    /**
     * Soft-delete a batch of variants by id.
     * Requires `paranoid: true` on the model.
     */
    async softDeleteMany(ids: number[], t?: Transaction): Promise<number> {
        if (!ids.length) return 0;
        return this.model.destroy({
            where: { id: { [Op.in]: ids } },
            transaction: t,
        });
    }

    /**
     * Return just the prices of all variants for a product.
     * Used for price-range denormalization (now handled by a model hook).
     */
    async getPricesByProduct(
        productId: number,
        t?: Transaction,
    ): Promise<number[]> {
        const rows = await this.model.findAll({
            where: { product_id: productId },
            attributes: ['price'],
            transaction: t,
        });
        return rows
            .map((v) => Number(v.price))
            .filter((n) => !Number.isNaN(n) && n > 0);
    }

    /**
     * Bulk create variants. Used by bulk-import flows.
     */
    async createMany(
        rows: Partial<ProductVariantModel>[],
        t?: Transaction,
    ): Promise<ProductVariantModel[]> {
        if (!rows.length) return [];
        return this.model.bulkCreate(rows as any, {
            transaction: t,
            returning: true,
        });
    }
}
