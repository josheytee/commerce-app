import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InventoryModel } from 'src/infrastructure';
import { BaseRepository } from './base.repository';
import { Transaction } from 'sequelize';

@Injectable()
export class InventoryRepository extends BaseRepository<InventoryModel> {
    constructor(
        @InjectModel(InventoryModel)
        private inventoryModel: typeof InventoryModel,
    ) {
        super(inventoryModel);
    }

    async findByVariantId(
        variantId: number,
        transaction?: Transaction,
    ): Promise<InventoryModel> {
        return this.inventoryModel.findOne({
            where: { product_variant_id: variantId },
            transaction,
        });
    }

    async reserveStock(
        variantId: number,
        quantity: number,
        transaction?: Transaction,
    ): Promise<void> {
        await this.inventoryModel.increment('reserved_quantity', {
            by: quantity,
            where: { product_variant_id: variantId },
            transaction,
        });
    }

    async releaseStock(
        variantId: number,
        quantity: number,
        transaction?: Transaction,
    ): Promise<void> {
        await this.inventoryModel.decrement('reserved_quantity', {
            by: quantity,
            where: { product_variant_id: variantId },
            transaction,
        });
    }
}
