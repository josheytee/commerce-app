import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import {
    InventoryModel,
    InventoryReservationModel,
    ProductModel,
    ProductVariantModel,
} from 'src/infrastructure';
import {
    InventoryRepository,
    InventoryReservationRepository,
    VariantRepository,
} from 'src/infrastructure/database/repositories';
import {
    FulfillmentTypeEnum,
    InventoryReservationStatusEnum as ReservationStatusEnum,
} from 'src/shared';

const RESERVATION_TTL_MS = 15 * 60 * 1000;

export interface ReservationRequest {
    variant_id: number;
    quantity: number;
}

@Injectable()
export class InventoryReservationService {
    private readonly logger = new Logger(InventoryReservationService.name);

    constructor(
        private readonly sequelize: Sequelize,
        private readonly inventoryRepo: InventoryRepository,
        private readonly reservationRepo: InventoryReservationRepository,
        private readonly variantRepo: VariantRepository,
    ) { }

    /**
     * Reserve inventory for the given items.
     *
     * Invariants:
     *   - Items are processed in variant_id order (prevents deadlocks between
     *     concurrent checkouts that reserve the same variants in different order).
     *   - Each inventory row is SELECT ... FOR UPDATE locked before decrement.
     *   - Physical variants only — digital/service items are skipped.
     *   - On any failure, the transaction rolls back all prior reservations.
     *
     * Returns a map keyed by variant_id. Callers use it to link reservations
     * to order items after the orders are created.
     */
    async reserveItems(
        items: ReservationRequest[],
        t: Transaction,
    ): Promise<Map<number, InventoryReservationModel>> {
        const result = new Map<number, InventoryReservationModel>();
        if (!items.length) return result;

        // ---- 1. Batch-load variants ----
        const variantIds = [...new Set(items.map((i) => i.variant_id))];
        const variants = await this.variantRepo.findAll({
            where: { id: { [Op.in]: variantIds } },
            include: [{ model: ProductModel, as: 'product' }],
            transaction: t,
        });
        const variantMap = new Map(variants.map((v) => [v.id, v]));

        // ---- 2. Identify physical variants (need reservation) ----
        const physicalVariantIds: number[] = [];
        for (const variantId of variantIds) {
            const variant = variantMap.get(variantId);
            if (!variant) {
                throw new NotFoundException(`Variant ${variantId} not found`);
            }
            if (
                this.resolveFulfillmentType(variant) === FulfillmentTypeEnum.PHYSICAL
            ) {
                physicalVariantIds.push(variantId);
            }
        }
        if (!physicalVariantIds.length) return result;

        // ---- 3. Sort by variant_id to establish a global lock order ----
        // Both the *lock* and the *reservation creation* must follow this order.
        const sorted = [...items].sort((a, b) => a.variant_id - b.variant_id);

        // ---- 4. Lock all inventories in variant_id order ----
        const inventories = await this.inventoryRepo.findAll({
            where: { variant_id: { [Op.in]: physicalVariantIds } },
            lock: t.LOCK.UPDATE,
            transaction: t,
            order: [['variant_id', 'ASC']],
        });
        const inventoryMap = new Map(inventories.map((i) => [i.variant_id, i]));

        // ---- 5. Validate and reserve ----
        for (const item of sorted) {
            const variant = variantMap.get(item.variant_id);
            if (!variant) continue;
            if (
                this.resolveFulfillmentType(variant) !== FulfillmentTypeEnum.PHYSICAL
            ) {
                continue;
            }

            const inventory = inventoryMap.get(item.variant_id);
            if (!inventory) {
                throw new BadRequestException(
                    `No inventory row for variant ${item.variant_id}`,
                );
            }

            const stock = Number(inventory.stock_quantity);
            const reserved = Number(inventory.reserved_quantity);
            const available = stock - reserved;

            if (available < item.quantity) {
                throw new BadRequestException(
                    `Insufficient stock for variant ${item.variant_id} ` +
                    `(requested ${item.quantity}, available ${Math.max(0, available)})`,
                );
            }

            const newReserved = reserved + item.quantity;
            await inventory.update(
                { reserved_quantity: newReserved },
                { transaction: t },
            );
            inventory.reserved_quantity = newReserved;

            const reservation = await this.reservationRepo.createWithTransaction(
                {
                    variant_id: item.variant_id,
                    cart_item_id: null,
                    quantity: item.quantity,
                    status: ReservationStatusEnum.HELD,
                    expires_at: new Date(Date.now() + RESERVATION_TTL_MS),
                } as any,
                t,
            );

            result.set(item.variant_id, reservation);
        }

        return result;
    }

    /**
     * Commit a reservation on successful payment.
     *
     * Decrements both stock_quantity and reserved_quantity — the units are
     * now sold and no longer "held". Idempotent: if the reservation is not
     * HELD, this is a no-op.
     */
    async commitReservation(
        reservationId: number,
        t: Transaction,
    ): Promise<void> {
        const reservation = await this.reservationRepo.findById(reservationId, {
            transaction: t,
            lock: t.LOCK.UPDATE,
        });

        if (!reservation) {
            throw new NotFoundException(`Reservation ${reservationId} not found`);
        }
        if (reservation.status !== ReservationStatusEnum.HELD) {
            // Already committed/released — idempotent no-op
            return;
        }

        const inventory = await this.inventoryRepo.findOne({
            where: { variant_id: reservation.variant_id },
            lock: t.LOCK.UPDATE,
            transaction: t,
        });
        if (!inventory) {
            throw new Error(
                `Inventory row missing for variant ${reservation.variant_id} ` +
                `while committing reservation ${reservationId}`,
            );
        }

        const stock = Number(inventory.stock_quantity);
        const reserved = Number(inventory.reserved_quantity);
        const qty = Number(reservation.quantity);

        const newStock = stock - qty;
        const newReserved = Math.max(0, reserved - qty);

        if (newStock < 0) {
            this.logger.error(
                `Stock going negative on variant ${reservation.variant_id}: ` +
                `stock=${stock}, qty=${qty}`,
            );
        }
        if (newReserved !== reserved - qty) {
            this.logger.warn(
                `Reserved drift on variant ${reservation.variant_id}: ` +
                `reserved=${reserved}, releasing=${qty}, clamped to ${newReserved}`,
            );
        }

        await this.inventoryRepo.updateWithTransaction(
            inventory.id,
            { stock_quantity: Math.max(0, newStock), reserved_quantity: newReserved },
            t,
        );

        await this.reservationRepo.updateWithTransaction(
            reservation.id,
            { status: ReservationStatusEnum.COMMITTED },
            t,
        );
    }

    /**
     * Release a reservation (payment failed, order cancelled, expired).
     *
     * Only decrements reserved_quantity — stock is untouched. Idempotent.
     * Clamps at zero and logs a warning if drift is detected (shouldn't happen,
     * but if it does, we want to see it, not hide it).
     */
    async releaseReservation(
        reservationId: number,
        t: Transaction,
    ): Promise<void> {
        const reservation = await this.reservationRepo.findById(reservationId, {
            transaction: t,
            lock: t.LOCK.UPDATE,
        });
        if (!reservation) return;
        if (
            reservation.status === ReservationStatusEnum.RELEASED ||
            reservation.status === ReservationStatusEnum.COMMITTED
        ) {
            return;
        }

        const inventory = await this.inventoryRepo.findOne({
            where: { variant_id: reservation.variant_id },
            lock: t.LOCK.UPDATE,
            transaction: t,
        });

        if (!inventory) {
            this.logger.error(
                `Inventory row missing for variant ${reservation.variant_id} ` +
                `while releasing reservation ${reservationId} — marking released`,
            );
            await this.reservationRepo.updateWithTransaction(
                inventory.id,
                { status: ReservationStatusEnum.RELEASED },
                t,
            );
            return;
        }

        const reserved = Number(inventory.reserved_quantity);
        const qty = Number(reservation.quantity);
        const newReserved = Math.max(0, reserved - qty);

        if (newReserved !== reserved - qty) {
            this.logger.warn(
                `Reserved drift on variant ${reservation.variant_id}: ` +
                `reserved=${reserved}, releasing=${qty}, clamped to ${newReserved}`,
            );
        }

        await inventory.update(
            { reserved_quantity: newReserved },
            { transaction: t },
        );
        await reservation.update(
            { status: ReservationStatusEnum.RELEASED },
            { transaction: t },
        );
    }

    /**
     * Expire stale HELD reservations. Called by a cron job.
     * Returns the number of reservations expired.
     */
    async expireStaleReservations(): Promise<number> {
        let count = 0;
        await this.sequelize.transaction(async (t) => {
            const stale = await this.reservationRepo.findAll({
                where: {
                    status: ReservationStatusEnum.HELD,
                    expires_at: { [Op.lt]: new Date() },
                },
                lock: t.LOCK.UPDATE,
                transaction: t,
                limit: 500, // cap per run to avoid long locks
            });

            for (const reservation of stale) {
                await this.releaseReservation(reservation.id, t);
                count++;
            }
        });
        if (count > 0) {
            this.logger.log(`Expired ${count} stale inventory reservation(s)`);
        }
        return count;
    }

    private resolveFulfillmentType(
        variant: ProductVariantModel & { product?: ProductModel },
    ): FulfillmentTypeEnum {
        const productType = variant?.product?.product_type;
        if (productType === 'service') return FulfillmentTypeEnum.SERVICE;
        if (productType === 'digital') return FulfillmentTypeEnum.DIGITAL;
        return FulfillmentTypeEnum.PHYSICAL;
    }
}
