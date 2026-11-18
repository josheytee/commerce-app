import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InventoryModel } from 'src/infrastructure';
import { BaseRepository } from './base.repository';
import { Op, Transaction } from 'sequelize';

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
            where: { variant_id: variantId },
            transaction,
        });
    }

    async reserveStock(
        variantId: number,
        quantity: number,
        transaction?: Transaction,
    ): Promise<void> {
        await this.increment('reserved_quantity', {
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
        await this.increment('reserved_quantity', {
            by: quantity,
            where: { product_variant_id: variantId },
            transaction,
        });
    }

    async decrementQuantity(reservation: any, transaction?: Transaction) {
        return await this.decrement(
            {
                stock_quantity: reservation.quantity,
                reserved_quantity: reservation.quantity,
            },
            {
                where: {
                    variant_id: reservation.variant_id,
                    store_id: reservation.store_id,
                },
                transaction,
            },
        );
    }

    async decrement(data: any, conditionOrOptions: any) {
        if (conditionOrOptions && conditionOrOptions.where) {
            return await this.inventoryModel.decrement(data, conditionOrOptions);
        }
        return await this.inventoryModel.decrement(data, {
            where: conditionOrOptions,
        });
    }

    async increment(data: any, conditionOrOptions: any) {
        if (conditionOrOptions && conditionOrOptions.where) {
            return await this.inventoryModel.increment(data, conditionOrOptions);
        }
        return await this.inventoryModel.increment(data, {
            where: conditionOrOptions,
        });
    }


    async zeroOutByVariant(variantId: number, t?: Transaction) {
        return this.model.update(
            { stock_quantity: 0, reserved_quantity: 0 },
            { where: { variant_id: variantId }, transaction: t },
        );
    }

    /**
  * Create an inventory row for a variant at a store.
  * Idempotency is enforced by the unique (variant_id, store_id) constraint,
  * so duplicate calls will throw — callers should know this is the "first insert".
  */
    async createForVariant(
        variantId: number,
        storeId: number,
        quantity: number,
        t?: Transaction,
    ): Promise<InventoryModel> {
        return this.model.create(
            {
                variant_id: variantId,
                store_id: storeId,
                stock_quantity: quantity,
                reserved_quantity: 0,
            } as any,
            { transaction: t },
        );
    }

    /**
     * Zero out stock for a batch of variants (used on soft-delete).
     * Keeps the rows so history is preserved.
     */
    async zeroOutByVariants(ids: number[], t?: Transaction): Promise<number> {
        if (!ids.length) return 0;
        const [affected] = await this.model.update(
            { stock_quantity: 0, reserved_quantity: 0 },
            {
                where: { variant_id: { [Op.in]: ids } },
                transaction: t,
            },
        );
        return affected;
    }

    /**
     * Find-or-create semantics for "set initial stock" during updates.
     * Returns [instance, created].
     */
    async findOrCreateForVariant(
        variantId: number,
        // storeId: number,
        quantity: number,
        t?: Transaction,
    ): Promise<[InventoryModel, boolean]> {
        return this.model.findOrCreate({
            where: { variant_id: variantId },
            defaults: {
                variant_id: variantId,
                // store_id: storeId,
                stock_quantity: quantity,
                reserved_quantity: 0,
            } as any,
            transaction: t,
            returning: true,
        });
    }
}
