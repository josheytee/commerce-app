// src/infrastructure/database/repositories/order.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction, WhereOptions, Includeable } from 'sequelize';

import { BaseRepository } from './base.repository';
import {
    CheckoutSessionModel,
    CustomerModel,
    OrderItemModel,
    OrderModel,
    OrderStatusHistoryModel,
    ProductVariantModel,
    ShipmentModel,
    StoreModel,
    VendorModel,
} from '../models';
import { OrderStatusEnum } from 'src/shared';
import { OrderSearchCriteria } from 'src/modules/vendor/orders/order-search-criteria.interface';

// ============================================================
// ORDER REPOSITORY
// ============================================================
// Notes:
//   - "Sub-order" concept removed; Orders ARE the fulfillment units.
//   - All read methods accept optional `transaction` for composition.
//   - Includes are constructed via helper methods so callers can reuse
//     the standard eager-load shapes.
// ============================================================

@Injectable()
export class OrderRepository extends BaseRepository<OrderModel> {
    constructor(
        @InjectModel(OrderModel)
        private readonly orderModel: typeof OrderModel,
    ) {
        super(orderModel);
    }

    // ============================================================
    // INCLUDE SHAPES
    // ============================================================

    /** Items only — used by vendor list views. */
    private itemsInclude(): Includeable {
        return {
            model: OrderItemModel,
            as: 'items',
            include: [{ model: ProductVariantModel, as: 'variant' }],
        };
    }

    /** Full detail — used by customer "get order" and vendor "get order". */
    private fullDetailInclude(): Includeable[] {
        return [
            {
                model: OrderItemModel,
                as: 'items',
                include: [
                    {
                        model: ProductVariantModel,
                        as: 'variant',
                        include: [{ association: 'product' }],
                    },
                    { model: StoreModel, as: 'store' },
                ],
            },
            { model: VendorModel, as: 'vendor' },
            { model: StoreModel, as: 'store' },
            // { model: OrderStatusHistoryModel, as: 'status_history' },
            // {
            //     model: ShipmentModel,
            //     as: 'shipments',
            //     include: [{ association: 'events' }],
            // },
        ];
    }

    /** Tracking view — shipments + events, minimal items. */
    private trackingInclude(): Includeable[] {
        return [
            {
                model: OrderItemModel,
                as: 'items',
                include: [{ model: ProductVariantModel, as: 'variant' }],
            },
            {
                model: ShipmentModel,
                as: 'shipments',
                include: [{ association: 'events' }],
            },
            { model: CheckoutSessionModel, as: 'checkout_session' },
        ];
    }

    // ============================================================
    // LOOKUPS
    // ============================================================

    /**
     * Lookup by order reference (internal ID, e.g. "ORD-20250115-0001").
     * Returns null when not found — callers decide whether that's an error.
     */
    async findByReference(
        orderReference: string,
        options: { include?: Includeable[]; transaction?: Transaction } = {},
    ): Promise<OrderModel | null> {
        return this.orderModel.findOne({
            where: { order_reference: orderReference },
            include: options.include,
            transaction: options.transaction,
        });
    }

    /**
     * Lookup by the payment provider's transaction id. The transaction id
     * lands on `CheckoutSession.payment_reference`, not on the order.
     */
    async findByPaymentReference(
        paymentReference: string,
        options: { include?: Includeable[]; transaction?: Transaction } = {},
    ): Promise<OrderModel | null> {
        return this.orderModel.findOne({
            include: [
                {
                    model: CheckoutSessionModel,
                    as: 'checkout_session',
                    required: true,
                    where: { payment_reference: paymentReference },
                },
                ...(options.include ?? []),
            ],
            transaction: options.transaction,
        });
    }

    /**
     * Find order with full detail includes. Throws if not found.
     */
    async findByIdWithDetails(
        orderId: number,
        options: { transaction?: Transaction } = {},
    ): Promise<OrderModel> {
        const order = await this.orderModel.findByPk(orderId, {
            include: this.fullDetailInclude(),
            transaction: options.transaction,
        });
        if (!order) {
            throw new NotFoundException(`Order ${orderId} not found`);
        }
        return order;
    }

    /**
     * Find with tracking includes. Throws if not found.
     */
    async findByIdWithTracking(
        orderId: number,
        options: { transaction?: Transaction } = {},
    ): Promise<OrderModel> {
        const order = await this.orderModel.findByPk(orderId, {
            include: this.trackingInclude(),
            transaction: options.transaction,
        });
        if (!order) {
            throw new NotFoundException(`Order ${orderId} not found`);
        }
        return order;
    }

    /**
     * Find order with items + inventories + vendor + store.
     * The exact shape `publishProduct` and the checkout service expect.
     */
    async findForCheckout(
        orderId: number,
        options: { transaction?: Transaction } = {},
    ): Promise<OrderModel | null> {
        return this.orderModel.findByPk(orderId, {
            include: [
                {
                    model: OrderItemModel,
                    as: 'items',
                },
                { model: VendorModel, as: 'vendor' },
                { model: StoreModel, as: 'store' },
            ],
            transaction: options.transaction,
        });
    }

    /**
     * Find all orders in a checkout session. Ordered by id for determinism.
     */
    async findByCheckoutSessionId(
        checkoutSessionId: number,
        options: { include?: Includeable[]; transaction?: Transaction } = {},
    ): Promise<OrderModel[]> {
        return this.orderModel.findAll({
            where: { checkout_session_id: checkoutSessionId },
            include: options.include,
            order: [['id', 'ASC']],
            transaction: options.transaction,
        });
    }

    // ============================================================
    // VENDOR QUERIES
    // ============================================================

    /**
     * Paginated list of orders for a vendor, optionally filtered by status.
     */
    async findAndCountByVendor(
        vendorId: number,
        options: {
            status?: OrderStatusEnum;
            page?: number;
            limit?: number;
            transaction?: Transaction;
        } = {},
    ): Promise<{ rows: OrderModel[]; count: number }> {
        const page = options.page ?? 1;
        const limit = options.limit ?? 20;

        const where: WhereOptions = { vendor_id: vendorId };
        if (options.status) (where as any).status = options.status;

        return this.orderModel.findAndCountAll({
            where,
            include: [this.itemsInclude()],
            order: [['created_at', 'DESC']],
            limit,
            offset: (page - 1) * limit,
            distinct: true,
            transaction: options.transaction,
        });
    }

    /**
     * Legacy shape — vendor + status, no pagination.
     * Prefer `findAndCountByVendor`.
     */
    async findOrdersByVendorAndStatus(
        vendorId: number,
        status: OrderStatusEnum,
    ): Promise<OrderModel[]> {
        return this.orderModel.findAll({
            where: { vendor_id: vendorId, status },
            include: [this.itemsInclude()],
            order: [['created_at', 'DESC']],
        });
    }

    /**
     * All orders for a vendor, no pagination. Used by stats aggregation.
     */
    async findAllByVendorId(
        vendorId: number,
        options: { transaction?: Transaction } = {},
    ): Promise<OrderModel[]> {
        return this.orderModel.findAll({
            where: { vendor_id: vendorId },
            transaction: options.transaction,
        });
    }

    // ============================================================
    // CUSTOMER QUERIES
    // ============================================================

    /**
     * Paginated list of orders for a customer, optionally filtered by status.
     * Uses the checkout_session link because that's where customer_id lives
     * — orders themselves don't carry a customer_id (they carry it via the
     * session). If your OrderModel has customer_id denormalized, you can
     * filter directly; keep the session scope for consistency.
     */
    async findAndCountByCustomer(
        customerId: number,
        options: {
            status?: OrderStatusEnum;
            page?: number;
            limit?: number;
            transaction?: Transaction;
        } = {},
    ): Promise<{ rows: OrderModel[]; count: number }> {
        const page = options.page ?? 1;
        const limit = options.limit ?? 10;

        const sessionIds = await this.getCustomerSessionIds(
            customerId,
            options.transaction,
        );
        if (!sessionIds.length) return { rows: [], count: 0 };

        const where: WhereOptions = {
            checkout_session_id: { [Op.in]: sessionIds },
        };
        if (options.status) (where as any).status = options.status;

        return this.orderModel.findAndCountAll({
            where,
            include: [this.itemsInclude()],
            order: [['created_at', 'DESC']],
            limit,
            offset: (page - 1) * limit,
            distinct: true,
            transaction: options.transaction,
        });
    }

    /**
     * Order detail for a specific customer. Enforces ownership via the
     * session link. Throws 404 on mismatch (prevents enumeration).
     */
    async findOneByCustomerId(
        customerId: number,
        orderId: number,
        options: { transaction?: Transaction } = {},
    ): Promise<OrderModel> {
        const order = await this.orderModel.findOne({
            where: { id: orderId },
            include: [
                {
                    model: CheckoutSessionModel,
                    as: 'checkout_session',
                    required: true,
                    where: { customer_id: customerId },
                },
                ...this.fullDetailInclude(),
            ],
            transaction: options.transaction,
        });

        if (!order) {
            throw new NotFoundException(`Order ${orderId} not found`);
        }
        return order;
    }

    /**
     * Search customer's orders by reference/status. Returns all matches.
     */
    async searchByCustomer(
        customerId: number,
        criteria: {
            status?: OrderStatusEnum;
            orderReference?: string;
        },
        options: { transaction?: Transaction } = {},
    ): Promise<OrderModel[]> {
        const sessionIds = await this.getCustomerSessionIds(
            customerId,
            options.transaction,
        );
        if (!sessionIds.length) return [];

        const where: WhereOptions = {
            checkout_session_id: { [Op.in]: sessionIds },
        };
        if (criteria.status) (where as any).status = criteria.status;
        if (criteria.orderReference)
            (where as any).order_reference = criteria.orderReference;

        return this.orderModel.findAll({
            where,
            include: [this.itemsInclude()],
            order: [['created_at', 'DESC']],
            transaction: options.transaction,
        });
    }

    // ============================================================
    // GENERIC CRITERIA (internal callers: webhooks, jobs)
    // ============================================================

    /**
     * Find an order by a small set of well-typed criteria. Returns null when
     * not found — callers decide whether to throw.
     *
     * Prefer `findByIdWithDetails`, `findByReference`, or `findByPaymentReference`
     * in new code. This exists for internal dispatch where the caller only
     * knows one identifier.
     */
    async findOneByCriteria(
        criteria: OrderSearchCriteria,
        options: { transaction?: Transaction } = {},
    ): Promise<OrderModel | null> {
        const where: WhereOptions = {};

        if (criteria.id !== undefined) (where as any).id = criteria.id;
        if (criteria.orderReference)
            (where as any).order_reference = criteria.orderReference;
        if (criteria.status) (where as any).status = criteria.status;

        return this.orderModel.findOne({
            where,
            include: this.fullDetailInclude(),
            transaction: options.transaction,
        });
    }

    // ============================================================
    // MUTATIONS
    // ============================================================

    async softDelete(id: number, t?: Transaction): Promise<number> {
        return this.orderModel.destroy({ where: { id }, transaction: t });
    }

    /**
     * Update all items belonging to an order.
     */
    async updateItemsByOrderId(
        orderId: number,
        patch: Partial<OrderItemModel>,
        t?: Transaction,
    ): Promise<number> {
        const [affected] = await OrderItemModel.update(patch as any, {
            where: { order_id: orderId },
            transaction: t,
        });
        return affected;
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    private async getCustomerSessionIds(
        customerId: number,
        t?: Transaction,
    ): Promise<number[]> {
        const sessions = await CheckoutSessionModel.findAll({
            where: { customer_id: customerId },
            attributes: ['id'],
            transaction: t,
        });
        return sessions.map((s) => s.id);
    }
}
