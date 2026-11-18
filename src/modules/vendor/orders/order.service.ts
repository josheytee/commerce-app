// src/modules/order/order.service.ts
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Transaction, Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { nanoid } from 'nanoid';

import { PaymentService } from 'src/infrastructure/payment/payment.service';
import { CustomerService } from 'src/modules/user/customer/customer.service';
import { AddressService } from 'src/modules/user/addresses/address.service';

import {
  CartModel,
  CartItemModel,
  CheckoutSessionModel,
  OrderModel,
  OrderItemModel,
  ProductVariantModel,
  ProductModel,
  StoreModel,
  VendorModel,
  ServiceBookingModel,
  ShipmentModel,
  ShipmentEventModel,
  OrderStatusHistoryModel,
  CustomerModel,
  InventoryReservationModel,
} from 'src/infrastructure';

import {
  OrderRepository,
  OrderItemRepository,
  CheckoutSessionRepository,
  CartRepository,
  ServiceBookingRepository,
  ShipmentRepository,
  ShipmentEventRepository,
  OrderStatusHistoryRepository,
  DigitalDeliveryRepository,
  VariantRepository,
  InventoryRepository,
  InventoryReservationRepository,
  VendorRepository,
  StoreRepository,
} from 'src/infrastructure/database/repositories';

import {
  OrderStatusEnum,
  OrderItemStatusEnum,
  PaymentStatusEnum,
  PaymentProviderEnum,
  FulfillmentTypeEnum,
  InventoryReservationStatusEnum as ReservationStatusEnum,
  BookingStatusEnum,
  CartStatusEnum,
} from 'src/shared';

import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { AddressSnapshot } from './dto/address-snapshot.dto';
import { InventoryReservationService } from '../inventory/inventory-reservation.service';

// ============================================================
// ORDER SERVICE
// ============================================================
// Invariants:
//   - CheckoutSession = payment shell (1 per attempt, 1 payment)
//   - Order           = fulfillment unit (1 per vendor+store)
//   - OrderItem       = belongs to Order only
//   - Inventory       = one row per variant; stock + reserved counters
//   - Reservations    = HELD → COMMITTED | RELEASED
//   - Money is DECIMAL in DB. Sequelize returns strings. We only convert
//     via toMoney() at the boundary and store strings back.
//   - Snapshots are immutable after creation
// ============================================================

const CHECKOUT_TTL_MS = 30 * 60 * 1000;
const TAX_RATE = 0.075;
const PLATFORM_FEE_RATE = 0.1;
const CURRENCY = 'USD';

// ------------------------------------------------------------
// Money helpers
// ------------------------------------------------------------
const toMoney = (v: string | number | null | undefined): number => {
  if (v === null || v === undefined) return 0;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
};

const round2 = (n: number): number => Math.round(n * 100) / 100;
const moneyStr = (n: number): string => round2(n).toFixed(2);

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly customerService: CustomerService,
    private readonly addressService: AddressService,
    private readonly reservationService: InventoryReservationService,
    private readonly sequelize: Sequelize,

    private readonly checkoutSessionRepo: CheckoutSessionRepository,
    private readonly orderRepo: OrderRepository,
    private readonly orderItemRepo: OrderItemRepository,
    private readonly cartRepo: CartRepository,
    private readonly inventoryRepo: InventoryRepository,
    private readonly inventoryReservationRepo: InventoryReservationRepository,
    private readonly serviceBookingRepo: ServiceBookingRepository,
    private readonly shipmentRepo: ShipmentRepository,
    private readonly shipmentEventRepo: ShipmentEventRepository,
    private readonly orderStatusHistoryRepo: OrderStatusHistoryRepository,
    private readonly digitalDeliveryRepo: DigitalDeliveryRepository,
    private readonly vendorRepo: VendorRepository,
    private readonly storeRepo: StoreRepository,
    private readonly variantRepo: VariantRepository,
  ) { }

  // ============================================================
  // CHECKOUT CREATION
  // ============================================================

  async createCheckoutFromCart(
    customerId: number,
    shippingAddressId: number,
    idempotencyKey: string,
  ): Promise<{
    checkout_session: CheckoutSessionModel;
    orders: OrderModel[];
    payment_url: string | null;
  }> {
    const existing = await this.checkoutSessionRepo.findOne({
      where: { idempotency_key: idempotencyKey },
      include: [
        {
          model: OrderModel,
          as: 'orders',
          include: [{ model: OrderItemModel, as: 'items' }],
        },
      ],
    });
    if (existing) {
      this.logger.warn(`Idempotency key ${idempotencyKey} reused`);
      return {
        checkout_session: existing,
        orders: existing.orders ?? [],
        payment_url: null,
      };
    }

    const shippingAddress =
      await this.addressService.getSnapshotOrThrow(shippingAddressId);
    const billingAddress = shippingAddress;

    const { sessionId } = await this.sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ },
      async (t) => {
        const cart = await this.loadActiveCartForCheckout(customerId, t);
        this.validateCartReservations(cart.items);

        const session = await this.checkoutSessionRepo.createWithTransaction(
          {
            idempotency_key: idempotencyKey,
            checkout_reference: this.generateCheckoutReference(),
            customer_id: customerId,
            cart_id: cart.id,
            subtotal: '0.00',
            tax_amount: '0.00',
            shipping_amount: '0.00',
            discount_amount: '0.00',
            total_amount: '0.00',
            refunded_amount: '0.00',
            currency: CURRENCY,
            payment_status: PaymentStatusEnum.PENDING,
            expires_at: new Date(Date.now() + CHECKOUT_TTL_MS),
          } as any,
          t,
        );

        const groups = this.groupCartItemsByVendorAndStore(cart.items);
        const totals = { subtotal: 0, tax: 0, shipping: 0 };
        for (const group of groups) {
          const order = await this.createFulfillmentOrder(
            session.id,
            customerId,
            group,
            shippingAddress,
            billingAddress,
            t,
          );
          totals.subtotal += toMoney(order.subtotal);
          totals.tax += toMoney(order.tax_amount);
          totals.shipping += toMoney(order.shipping_amount);
        }

        await session.update(
          {
            subtotal: moneyStr(totals.subtotal),
            tax_amount: moneyStr(totals.tax),
            shipping_amount: moneyStr(totals.shipping),
            total_amount: moneyStr(
              totals.subtotal + totals.tax + totals.shipping,
            ),
          },
          { transaction: t },
        );

        await cart.update(
          { status: CartStatusEnum.CONVERTED },
          { transaction: t },
        );

        return { sessionId: session.id };
      },
    );

    const session = await this.checkoutSessionRepo.findById(sessionId);
    if (!session) throw new NotFoundException('Checkout session vanished');

    // If payment init fails, release reservations so inventory is not stuck.
    let paymentUrl: string;
    try {
      paymentUrl = await this.initializePayment(session, shippingAddress);
    } catch (err) {
      this.logger.error(
        `Payment init failed for session ${session.id}: ${(err as Error).message}`,
      );
      await this.failCheckoutSafely(
        session.id,
        `Payment initialization failed: ${(err as Error).message}`,
      );
      throw err;
    }

    const orders = await this.orderRepo.findAll({
      where: { checkout_session_id: sessionId },
      order: [['id', 'ASC']],
    });

    return { checkout_session: session, orders, payment_url: paymentUrl };
  }

  async createCheckoutFromItems(dto: CreateOrderDto): Promise<{
    checkout_session: CheckoutSessionModel;
    orders: OrderModel[];
    payment_url: string | null;
  }> {
    if (!dto.items?.length) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const existing = await this.checkoutSessionRepo.findOne({
      where: { idempotency_key: dto.idempotency_key },
      include: [{ model: OrderModel, as: 'orders' }],
    });
    if (existing) {
      return {
        checkout_session: existing,
        orders: existing.orders ?? [],
        payment_url: null,
      };
    }

    const shippingAddress = await this.addressService.getSnapshotOrThrow(
      dto.address_id,
    );
    const billingAddress = dto.address_id
      ? await this.addressService.getSnapshotOrThrow(dto.address_id)
      : shippingAddress;

    const { sessionId } = await this.sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ },
      async (t) => {
        const reservationByVariantId = await this.reservationService.reserveItems(
          dto.items.map((i) => ({
            variant_id: i.variant_id,
            quantity: i.quantity,
          })),
          t,
        );

        const session = await this.checkoutSessionRepo.createWithTransaction(
          {
            idempotency_key: dto.idempotency_key,
            checkout_reference: this.generateCheckoutReference(),
            customer_id: dto.customer_id,
            cart_id: (dto as any).cart_id ?? null,
            subtotal: '0.00',
            tax_amount: '0.00',
            shipping_amount: '0.00',
            discount_amount: '0.00',
            total_amount: '0.00',
            refunded_amount: '0.00',
            currency: CURRENCY,
            payment_status: PaymentStatusEnum.PENDING,
            expires_at: new Date(Date.now() + CHECKOUT_TTL_MS),
          } as any,
          t,
        );

        const groups = this.groupItemsByVendorAndStore(dto.items);
        const totals = { subtotal: 0, tax: 0, shipping: 0 };

        for (const group of groups) {
          const order = await this.createFulfillmentOrder(
            session.id,
            dto.customer_id,
            group,
            shippingAddress,
            billingAddress,
            t,
          );
          totals.subtotal += toMoney(order.subtotal);
          totals.tax += toMoney(order.tax_amount);
          totals.shipping += toMoney(order.shipping_amount);

          await this.linkReservationsToOrderItems(
            order.id,
            reservationByVariantId,
            t,
          );
        }

        await this.checkoutSessionRepo.updateWithTransaction(
          session.id,
          {
            subtotal: moneyStr(totals.subtotal),
            tax_amount: moneyStr(totals.tax),
            shipping_amount: moneyStr(totals.shipping),
            total_amount: moneyStr(
              totals.subtotal + totals.tax + totals.shipping,
            ),
          },
          t,
        );

        return { sessionId: session.id };
      },
    );

    const session = await this.checkoutSessionRepo.findById(sessionId);
    if (!session) throw new NotFoundException('Checkout session vanished');

    let paymentUrl: string;
    try {
      paymentUrl = await this.initializePayment(session, shippingAddress);
    } catch (err) {
      this.logger.error(
        `Payment init failed for session ${session.id}: ${(err as Error).message}`,
      );
      await this.failCheckoutSafely(
        session.id,
        `Payment initialization failed: ${(err as Error).message}`,
      );
      throw err;
    }

    const orders = await this.orderRepo.findAll({
      where: { checkout_session_id: sessionId },
      order: [['id', 'ASC']],
    });

    return { checkout_session: session, orders, payment_url: paymentUrl };
  }

  // ============================================================
  // PAYMENT CONFIRMATION / FAILURE
  // ============================================================

  async confirmCheckoutPayment(
    checkoutSessionId: number,
    paymentReference: string,
    provider: PaymentProviderEnum,
    providerPayload?: Record<string, unknown>,
  ): Promise<void> {
    await this.sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ },
      async (t) => {
        const session = await this.checkoutSessionRepo.findById(
          checkoutSessionId,
          {
            lock: t.LOCK.UPDATE,
            transaction: t,
            include: [
              {
                model: OrderModel,
                as: 'orders',
                include: [
                  {
                    model: OrderItemModel,
                    as: 'items',
                  },
                  { model: VendorModel, as: 'vendor' },
                  { model: StoreModel, as: 'store' },
                ],
              },
            ],
          },
        );

        if (!session) throw new NotFoundException('Checkout session not found');

        if (session.payment_status === PaymentStatusEnum.PAID) {
          this.logger.warn(`Session ${checkoutSessionId} already paid`);
          return;
        }
        if (
          session.payment_status === PaymentStatusEnum.FAILED ||
          session.payment_status === PaymentStatusEnum.CANCELLED ||
          session.payment_status === PaymentStatusEnum.REFUNDED ||
          session.payment_status === PaymentStatusEnum.PARTIALLY_REFUNDED ||
          session.payment_status === PaymentStatusEnum.EXPIRED
        ) {
          throw new BadRequestException(
            `Cannot confirm payment for session in state ${session.payment_status}`,
          );
        }

        // ---- Sanity: sum of orders must equal session total ----
        const ordersTotal = (session.orders ?? []).reduce(
          (sum, o) => sum + toMoney(o.total_amount),
          0,
        );
        const sessionTotal = toMoney(session.total_amount);
        if (Math.abs(ordersTotal - sessionTotal) > 0.01) {
          this.logger.error(
            `Session ${session.id} total mismatch: session=${sessionTotal} orders=${ordersTotal}`,
          );
          throw new Error(
            `Session ${session.id} total mismatch: session=${sessionTotal} orders=${ordersTotal}`,
          );
        }

        const now = new Date();
        await session.update(
          {
            payment_status: PaymentStatusEnum.PAID,
            payment_reference: paymentReference,
            payment_provider: provider,
            paid_at: now,
            payment_metadata: providerPayload ?? null,
          },
          { transaction: t },
        );

        for (const order of session.orders ?? []) {
          for (const item of order.items ?? []) {
            await this.applyFulfillmentOnPaid(item, t);
          }

          await order.update(
            {
              status: OrderStatusEnum.CONFIRMED,
              paid_at: now,
              amount_paid: order.total_amount,
            },
            { transaction: t },
          );

          if (
            order.fulfillment_mode === 'delivery' ||
            order.fulfillment_mode === 'pickup'
          ) {
            await this.shipmentRepo.createWithTransaction(
              { order_id: order.id, status: 'pending' } as any,
              t,
            );
          }

          await this.logStatusHistory(
            order.id,
            OrderStatusEnum.CONFIRMED,
            'Payment confirmed',
            'system',
            null,
            t,
          );
        }
      },
    );

    this.logger.log(`Checkout ${checkoutSessionId} confirmed`);
  }

  async handlePaymentFailure(
    checkoutSessionId: number,
    reason: string,
    failureCode?: string,
  ): Promise<void> {
    await this.sequelize.transaction(async (t) => {
      const session = await this.checkoutSessionRepo.findById(
        checkoutSessionId,
        {
          lock: t.LOCK.UPDATE,
          transaction: t,
          include: [
            {
              model: OrderModel,
              as: 'orders',
              include: [
                {
                  model: OrderItemModel,
                  as: 'items',
                  include: [
                    {
                      model: InventoryReservationModel,
                      as: 'inventory_reservation',
                    },
                    { model: ServiceBookingModel, as: 'service_booking' },
                  ],
                },
              ],
            },
          ],
        },
      );

      if (!session) return;

      if (
        session.payment_status === PaymentStatusEnum.PAID ||
        session.payment_status === PaymentStatusEnum.REFUNDED ||
        session.payment_status === PaymentStatusEnum.PARTIALLY_REFUNDED ||
        session.payment_status === PaymentStatusEnum.EXPIRED
      ) {
        this.logger.warn(
          `Ignoring payment failure for session ${checkoutSessionId} in state ${session.payment_status}`,
        );
        return;
      }

      const now = new Date();
      await session.update(
        {
          payment_status: PaymentStatusEnum.FAILED,
          failed_at: now,
          failure_code: failureCode ?? null,
          failure_message: reason,
        },
        { transaction: t },
      );

      for (const order of session.orders ?? []) {
        for (const item of order.items ?? []) {
          if (item.fulfillment_type === FulfillmentTypeEnum.PHYSICAL) {
            if (item.inventory_reservation) {
              await this.reservationService.releaseReservation(
                item.inventory_reservation.id,
                t,
              );
            }
          } else if (item.fulfillment_type === FulfillmentTypeEnum.SERVICE) {
            await this.cancelServiceBooking(item, t);
          }
        }

        await order.update(
          { status: OrderStatusEnum.PAYMENT_FAILED },
          { transaction: t },
        );

        await this.logStatusHistory(
          order.id,
          OrderStatusEnum.PAYMENT_FAILED,
          `Payment failed: ${reason}`,
          'system',
          null,
          t,
        );
      }
    });
  }

  async handlePaymentCallback(data: any): Promise<void> {
    const checkoutSessionId = data?.metadata?.checkout_session_id;
    if (!checkoutSessionId) {
      throw new BadRequestException('No checkout session found in callback');
    }

    const reference = data.transaction_id ?? data.tx_ref ?? data.reference;
    const provider =
      data?.provider === 'flutterwave'
        ? PaymentProviderEnum.FLUTTERWAVE
        : PaymentProviderEnum.PAYSTACK;

    if (data.status === 'successful' || data.status === 'completed') {
      await this.confirmCheckoutPayment(
        checkoutSessionId,
        reference,
        provider,
        data,
      );
    } else if (data.status === 'failed' || data.status === 'cancelled') {
      await this.handlePaymentFailure(
        checkoutSessionId,
        data.reason ?? 'Payment failed',
        data?.failure_code,
      );
    }
  }

  async retryPayment(
    checkoutSessionId: number,
  ): Promise<{ payment_url: string }> {
    const session = await this.checkoutSessionRepo.findById(checkoutSessionId, {
      include: [{ model: CustomerModel, as: 'customer' }],
    });
    if (!session) throw new NotFoundException('Checkout session not found');
    if (session.payment_status === PaymentStatusEnum.PAID) {
      throw new BadRequestException('Already paid');
    }
    if (session.expires_at && session.expires_at < new Date()) {
      throw new BadRequestException('Checkout session expired');
    }

    const firstOrder = await this.orderRepo.findOne({
      where: { checkout_session_id: checkoutSessionId },
      order: [['id', 'ASC']],
    });

    const address =
      (firstOrder?.shipping_address_snapshot as AddressSnapshot) ?? null;

    const paymentUrl = await this.initializePayment(session, address);
    return { payment_url: paymentUrl };
  }

  // ============================================================
  // REFUNDS
  // ============================================================

  async refundOrder(
    orderId: number,
    amount: number,
    reason: string,
    actorId: number | null = null,
  ): Promise<OrderModel> {
    if (amount <= 0) throw new BadRequestException('Refund amount must be > 0');

    await this.sequelize.transaction(async (t) => {
      const order = await this.orderRepo.findById(orderId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!order) throw new NotFoundException(`Order ${orderId} not found`);

      const already = toMoney(order.amount_refunded);
      const total = toMoney(order.total_amount);
      if (already + amount > total) {
        throw new BadRequestException(
          `Refund exceeds order total (${already} + ${amount} > ${total})`,
        );
      }

      const newRefunded = round2(already + amount);
      const fullyRefunded = newRefunded >= total;

      await order.update(
        {
          amount_refunded: moneyStr(newRefunded),
          status: fullyRefunded
            ? OrderStatusEnum.REFUNDED
            : OrderStatusEnum.PARTIALLY_REFUNDED,
        },
        { transaction: t },
      );

      await this.logStatusHistory(
        orderId,
        fullyRefunded
          ? OrderStatusEnum.REFUNDED
          : OrderStatusEnum.PARTIALLY_REFUNDED,
        `Refund of ${amount} issued: ${reason}`,
        'admin',
        actorId,
        t,
      );

      await this.recomputeSessionRefundedAmount(order.checkout_session_id, t);
    });

    return (await this.orderRepo.findById(orderId))!;
  }

  private async recomputeSessionRefundedAmount(
    checkoutSessionId: number,
    t: Transaction,
  ): Promise<void> {
    const orders = await this.orderRepo.findAll({
      where: { checkout_session_id: checkoutSessionId },
      transaction: t,
    });

    const refunded = orders.reduce(
      (sum, o) => sum + toMoney(o.amount_refunded),
      0,
    );
    const total = orders.reduce((sum, o) => sum + toMoney(o.total_amount), 0);

    const session = await this.checkoutSessionRepo.findById(checkoutSessionId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!session) return;

    let payment_status = session.payment_status;
    if (refunded >= total && total > 0) {
      payment_status = PaymentStatusEnum.REFUNDED;
    } else if (refunded > 0) {
      payment_status = PaymentStatusEnum.PARTIALLY_REFUNDED;
    }

    await session.update(
      {
        refunded_amount: moneyStr(refunded),
        payment_status,
        refunded_at:
          refunded > 0
            ? (session.refunded_at ?? new Date())
            : session.refunded_at,
      },
      { transaction: t },
    );
  }

  // ============================================================
  // ORDER LIFECYCLE
  // ============================================================

  async fulfillOrder(orderId: number): Promise<OrderModel> {
    await this.sequelize.transaction(async (t) => {
      const order = await this.orderRepo.findById(orderId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!order) throw new NotFoundException(`Order ${orderId} not found`);
      if (!this.isEligibleForFulfillment(order.status)) {
        throw new BadRequestException(
          `Order ${orderId} not eligible for fulfillment`,
        );
      }

      await order.update(
        { status: OrderStatusEnum.PROCESSING },
        { transaction: t },
      );

      await this.logStatusHistory(
        orderId,
        OrderStatusEnum.PROCESSING,
        'Order processing started',
        'vendor',
        order.vendor_id,
        t,
      );
    });

    return (await this.orderRepo.findById(orderId))!;
  }

  async shipOrder(
    orderId: number,
    trackingNumber: string,
    carrier: string,
  ): Promise<OrderModel> {
    await this.sequelize.transaction(async (t) => {
      const order = await this.orderRepo.findById(orderId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!order) throw new NotFoundException(`Order ${orderId} not found`);
      if (
        order.status !== OrderStatusEnum.CONFIRMED &&
        order.status !== OrderStatusEnum.PROCESSING
      ) {
        throw new BadRequestException('Order must be confirmed to ship');
      }

      await order.update(
        { status: OrderStatusEnum.OUT_FOR_DELIVERY, shipped_at: new Date() },
        { transaction: t },
      );

      await this.shipmentRepo.createWithTransaction(
        {
          order_id: orderId,
          carrier,
          tracking_number: trackingNumber,
          status: 'pending',
        } as any,
        t,
      );

      await this.orderItemRepo.updateByOrderId(
        orderId,
        { status: OrderItemStatusEnum.SHIPPED },
        t,
      );

      await this.logStatusHistory(
        orderId,
        OrderStatusEnum.OUT_FOR_DELIVERY,
        `Shipped via ${carrier}. Tracking: ${trackingNumber}`,
        'vendor',
        order.vendor_id,
        t,
      );
    });

    return (await this.orderRepo.findById(orderId))!;
  }

  async deliverOrder(orderId: number): Promise<OrderModel> {
    await this.sequelize.transaction(async (t) => {
      const order = await this.orderRepo.findById(orderId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!order) throw new NotFoundException(`Order ${orderId} not found`);
      if (order.status !== OrderStatusEnum.OUT_FOR_DELIVERY) {
        throw new BadRequestException('Order must be out for delivery');
      }

      await order.update(
        { status: OrderStatusEnum.DELIVERED, delivered_at: new Date() },
        { transaction: t },
      );

      await this.orderItemRepo.updateByOrderId(
        orderId,
        { status: OrderItemStatusEnum.DELIVERED },
        t,
      );

      await this.shipmentRepo.updateByOrderId(
        orderId,
        { status: 'delivered', actual_delivery: new Date() } as any,
        t,
      );

      await this.logStatusHistory(
        orderId,
        OrderStatusEnum.DELIVERED,
        'Order delivered',
        'system',
        null,
        t,
      );
    });

    return (await this.orderRepo.findById(orderId))!;
  }

  async completeOrder(orderId: number): Promise<OrderModel> {
    await this.sequelize.transaction(async (t) => {
      const order = await this.orderRepo.findById(orderId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!order) throw new NotFoundException(`Order ${orderId} not found`);
      if (order.status !== OrderStatusEnum.DELIVERED) {
        throw new BadRequestException('Order must be delivered to complete');
      }

      await order.update(
        { status: OrderStatusEnum.COMPLETED, completed_at: new Date() },
        { transaction: t },
      );

      await this.orderItemRepo.updateByOrderId(
        orderId,
        { status: OrderItemStatusEnum.COMPLETED },
        t,
      );

      await this.logStatusHistory(
        orderId,
        OrderStatusEnum.COMPLETED,
        'Order completed',
        'system',
        null,
        t,
      );
    });

    return (await this.orderRepo.findById(orderId))!;
  }

  async cancelOrder(
    orderId: number,
    reason?: string,
    actorType: string = 'system',
    actorId: number | null = null,
  ): Promise<OrderModel> {
    await this.sequelize.transaction(async (t) => {
      const order = await this.orderRepo.findById(orderId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
        include: [
          {
            model: OrderItemModel,
            as: 'items',
            include: [
              {
                model: InventoryReservationModel,
                as: 'inventory_reservation',
              },
              { model: ServiceBookingModel, as: 'service_booking' },
            ],
          },
        ],
      });
      if (!order) throw new NotFoundException(`Order ${orderId} not found`);
      if (order.status === OrderStatusEnum.COMPLETED) {
        throw new BadRequestException('Cannot cancel completed order');
      }
      if (order.status === OrderStatusEnum.CANCELLED) return;

      for (const item of order.items ?? []) {
        if (item.fulfillment_type === FulfillmentTypeEnum.PHYSICAL) {
          if (item.inventory_reservation) {
            await this.reservationService.releaseReservation(
              item.inventory_reservation.id,
              t,
            );
          }
        } else if (item.fulfillment_type === FulfillmentTypeEnum.SERVICE) {
          await this.cancelServiceBooking(item, t);
        }
      }

      await order.update(
        { status: OrderStatusEnum.CANCELLED, cancelled_at: new Date() },
        { transaction: t },
      );

      await this.orderItemRepo.updateByOrderId(
        orderId,
        { status: OrderItemStatusEnum.CANCELLED },
        t,
      );

      await this.logStatusHistory(
        orderId,
        OrderStatusEnum.CANCELLED,
        reason ?? 'Order cancelled',
        actorType,
        actorId,
        t,
      );
    });

    return (await this.orderRepo.findById(orderId))!;
  }

  async cancelCheckoutSession(
    checkoutSessionId: number,
    reason?: string,
  ): Promise<void> {
    const session = await this.checkoutSessionRepo.findById(checkoutSessionId, {
      include: [{ model: OrderModel, as: 'orders' }],
    });
    if (!session) throw new NotFoundException('Checkout session not found');
    if (session.payment_status === PaymentStatusEnum.PAID) {
      throw new BadRequestException('Cannot cancel a paid checkout');
    }

    for (const order of session.orders ?? []) {
      await this.cancelOrder(order.id, reason, 'customer', session.customer_id);
    }

    await session.update({
      payment_status: PaymentStatusEnum.CANCELLED,
      cancelled_at: new Date(),
      failure_message: reason ?? 'Checkout cancelled by customer',
    });
  }

  async requestOrderCancellation(
    orderId: number,
    customerId: number,
    reason: string,
  ): Promise<{ message: string; request_id: string }> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    const session = await this.checkoutSessionRepo.findById(
      order.checkout_session_id,
    );
    if (!session || session.customer_id !== customerId) {
      throw new ForbiddenException('Order does not belong to this customer');
    }

    if (!this.isCustomerCancellable(order.status)) {
      throw new BadRequestException(
        `Order ${orderId} cannot be cancelled (status: ${order.status})`,
      );
    }

    const requestId = `CANCEL-${orderId}-${Date.now()}`;
    const metadata = {
      ...(order.metadata ?? {}),
      cancellation_request: {
        request_id: requestId,
        requested_at: new Date(),
        reason,
        status: 'pending',
        requested_by: customerId,
      },
    };

    await order.update({ metadata });
    return {
      message: 'Cancellation request submitted successfully',
      request_id: requestId,
    };
  }

  // ============================================================
  // ORDER ITEM FULFILLMENT
  // ============================================================

  async fulfillOrderItem(
    itemId: number,
    quantity?: number,
  ): Promise<OrderItemModel> {
    await this.sequelize.transaction(async (t) => {
      const item = await this.orderItemRepo.findById(itemId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!item) throw new NotFoundException(`Item ${itemId} not found`);

      const qty = quantity ?? item.remaining_quantity;
      if (qty <= 0) throw new BadRequestException('Invalid quantity');
      if (qty > item.remaining_quantity) {
        throw new BadRequestException(
          `Cannot fulfill ${qty}, only ${item.remaining_quantity} remaining`,
        );
      }

      const newFulfilled = item.fulfilled_quantity + qty;
      const newStatus =
        newFulfilled >= item.quantity
          ? OrderItemStatusEnum.FULFILLED
          : OrderItemStatusEnum.PARTIALLY_FULFILLED;

      await item.update(
        { fulfilled_quantity: newFulfilled, status: newStatus },
        { transaction: t },
      );

      await this.checkOrderFulfillmentStatus(item.order_id, t);
    });

    return (await this.orderItemRepo.findById(itemId))!;
  }

  // ============================================================
  // RETRIEVAL
  // ============================================================

  async findCheckoutSessionById(
    sessionId: number,
  ): Promise<CheckoutSessionModel> {
    const session = await this.checkoutSessionRepo.findById(sessionId, {
      include: [
        {
          model: OrderModel,
          as: 'orders',
          include: [
            {
              model: OrderItemModel,
              as: 'items',
              include: [{ model: ProductVariantModel, as: 'variant' }],
            },
            { model: VendorModel, as: 'vendor' },
            { model: StoreModel, as: 'store' },
          ],
        },
        { model: CustomerModel, as: 'customer' },
      ],
    });
    if (!session) throw new NotFoundException('Checkout session not found');
    return session;
  }

  async findOrderById(orderId: number): Promise<OrderModel> {
    const order = await this.orderRepo.findById(orderId, {
      include: [
        {
          model: OrderItemModel,
          as: 'items',
          include: [{ model: ProductVariantModel, as: 'variant' }],
        },
        { model: VendorModel, as: 'vendor' },
        { model: StoreModel, as: 'store' },
        // { model: OrderStatusHistoryModel, as: 'status_history' },
        // { model: ShipmentModel, as: 'shipments' },
      ],
    });
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);
    return order;
  }

  async findOrdersByVendor(
    vendorId: number,
    status?: OrderStatusEnum,
    page = 1,
    limit = 20,
  ): Promise<{ rows: OrderModel[]; count: number }> {
    const where: WhereOptions = { vendor_id: vendorId };
    if (status) (where as any).status = status;

    return this.orderRepo.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: OrderItemModel,
          as: 'items',
          include: [{ model: ProductVariantModel, as: 'variant' }],
        },
      ],
    });
  }

  async findOrdersByCustomer(
    customerId: number,
    status?: OrderStatusEnum,
    page = 1,
    limit = 20,
  ): Promise<{ rows: OrderModel[]; count: number }> {
    const sessionIds = await this.getCustomerSessionIds(customerId);
    if (!sessionIds.length) return { rows: [], count: 0 };

    const where: WhereOptions = {
      checkout_session_id: { [Op.in]: sessionIds },
    };
    if (status) (where as any).status = status;

    return this.orderRepo.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset: (page - 1) * limit,
      // distinct: true,
      include: [
        {
          model: OrderItemModel,
          as: 'items',
          include: [{ model: ProductVariantModel, as: 'variant' }],
        },
        { model: StoreModel, as: 'store' },
      ],
    });
  }

  async getOrderTracking(customerId: number, orderId: number): Promise<any> {
    const order = await this.orderRepo.findById(orderId, {
      include: [
        {
          model: OrderItemModel,
          as: 'items',
          include: [{ model: ProductVariantModel, as: 'variant' }],
        },
        {
          model: ShipmentModel,
          as: 'shipments',
          include: [{ model: ShipmentEventModel, as: 'events' }],
        },
        { model: CheckoutSessionModel, as: 'checkout_session' },
      ],
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.checkout_session?.customer_id !== customerId) {
      throw new ForbiddenException('Unauthorized');
    }

    return {
      order_id: order.id,
      order_reference: order.order_reference,
      checkout_reference: order.checkout_session?.checkout_reference,
      status: order.status,
      items: (order.items ?? []).map((item) => ({
        item_id: item.id,
        product_name: item.variant?.variant_name,
        quantity: item.quantity,
        status: item.status,
      })),
      // shipments: (order.shipments ?? []).map((s) => ({
      //   tracking_number: s.tracking_number,
      //   carrier: s.carrier,
      //   status: s.status,
      //   estimated_delivery: s.estimated_delivery,
      //   events: (s.events ?? []).map((e) => ({
      //     timestamp: e.created_at,
      //     status: e.status,
      //     location: e.location,
      //     description: e.description,
      //   })),
      // })),
    };
  }

  async findOneByCustomerId(
    customerId: number,
    orderId: number,
  ): Promise<OrderModel> {
    return this.orderRepo.findOneByCustomerId(customerId, orderId);
  }

  async getOrderItemsByOrderId(orderId: number): Promise<OrderItemModel[]> {
    return this.orderItemRepo.findAll({ where: { order_id: orderId } });
  }

  async getOrderItem(itemId: number): Promise<OrderItemModel> {
    return (await this.orderItemRepo.findById(itemId))!;
  }

  // ============================================================
  // SHIPMENT EVENTS
  // ============================================================

  async addShipmentEvent(
    shipmentId: number,
    event: {
      status: string;
      location: string;
      description: string;
      raw_payload?: any;
    },
  ): Promise<ShipmentEventModel> {
    const shipment = await this.shipmentRepo.findById(shipmentId);
    if (!shipment) throw new NotFoundException('Shipment not found');

    return this.shipmentEventRepo.create({
      shipment_id: shipmentId,
      status: event.status,
      location: event.location,
      description: event.description,
      raw_payload: event.raw_payload ?? {},
    } as any);
  }

  // ============================================================
  // STATISTICS
  // ============================================================

  async getVendorStats(vendorId: number): Promise<Record<string, number>> {
    const orders = await this.orderRepo.findAll({
      where: { vendor_id: vendorId },
    });

    const stats: Record<string, number> = {
      total_orders: orders.length,
      pending_payment: 0,
      confirmed: 0,
      processing: 0,
      out_for_delivery: 0,
      delivered: 0,
      completed: 0,
      cancelled: 0,
      payment_failed: 0,
      total_revenue: 0,
      platform_fees: 0,
      net_earnings: 0,
      average_order_value: 0,
    };

    for (const order of orders) {
      switch (order.status) {
        case OrderStatusEnum.PENDING_PAYMENT: stats.pending_payment++; break;
        case OrderStatusEnum.CONFIRMED: stats.confirmed++; break;
        case OrderStatusEnum.PROCESSING: stats.processing++; break;
        case OrderStatusEnum.OUT_FOR_DELIVERY: stats.out_for_delivery++; break;
        case OrderStatusEnum.DELIVERED: stats.delivered++; break;
        case OrderStatusEnum.COMPLETED: stats.completed++; break;
        case OrderStatusEnum.CANCELLED: stats.cancelled++; break;
        case OrderStatusEnum.PAYMENT_FAILED: stats.payment_failed++; break;
        default: break;
      }

      const subtotal = toMoney(order.subtotal);
      const fee = toMoney(order.platform_fee);
      stats.total_revenue += subtotal;
      stats.platform_fees += fee;
      stats.net_earnings += subtotal - fee;
    }

    stats.average_order_value =
      stats.total_orders > 0 ? stats.total_revenue / stats.total_orders : 0;

    return stats;
  }

  async getCustomerOrderSummary(customerId: number) {
    const sessionIds = await this.getCustomerSessionIds(customerId);
    if (!sessionIds.length) {
      return {
        total_orders: 0,
        pending_payment: 0,
        confirmed: 0,
        processing: 0,
        out_for_delivery: 0,
        delivered: 0,
        completed: 0,
        cancelled: 0,
        total_spent: 0,
        average_order_value: 0,
        last_order_date: null as Date | null,
      };
    }

    const orders = await this.orderRepo.findAll({
      where: { checkout_session_id: { [Op.in]: sessionIds } },
    });

    const summary = {
      total_orders: orders.length,
      pending_payment: 0,
      confirmed: 0,
      processing: 0,
      out_for_delivery: 0,
      delivered: 0,
      completed: 0,
      cancelled: 0,
      total_spent: 0,
      average_order_value: 0,
      last_order_date: null as Date | null,
    };

    for (const order of orders) {
      switch (order.status) {
        case OrderStatusEnum.PENDING_PAYMENT: summary.pending_payment++; break;
        case OrderStatusEnum.CONFIRMED: summary.confirmed++; break;
        case OrderStatusEnum.PROCESSING: summary.processing++; break;
        case OrderStatusEnum.OUT_FOR_DELIVERY: summary.out_for_delivery++; break;
        case OrderStatusEnum.DELIVERED: summary.delivered++; break;
        case OrderStatusEnum.COMPLETED: summary.completed++; break;
        case OrderStatusEnum.CANCELLED: summary.cancelled++; break;
        default: break;
      }

      summary.total_spent += toMoney(order.total_amount);
      if (!summary.last_order_date || order.created_at > summary.last_order_date) {
        summary.last_order_date = order.created_at;
      }
    }

    summary.average_order_value =
      summary.total_orders > 0 ? summary.total_spent / summary.total_orders : 0;

    return summary;
  }

  // ============================================================
  // SEARCH
  // ============================================================

  async searchCustomerOrders(
    customerId: number,
    criteria: { status?: OrderStatusEnum; orderReference?: string },
  ): Promise<OrderModel[]> {
    const sessionIds = await this.getCustomerSessionIds(customerId);
    if (!sessionIds.length) return [];

    const where: WhereOptions = {
      checkout_session_id: { [Op.in]: sessionIds },
    };
    if (criteria.status) (where as any).status = criteria.status;
    if (criteria.orderReference)
      (where as any).order_reference = criteria.orderReference;

    return this.orderRepo.findAll({
      where,
      include: [
        {
          model: OrderItemModel,
          as: 'items',
          include: [{ model: ProductVariantModel, as: 'variant' }],
        },
        { model: StoreModel, as: 'store' },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async updateOrderStatus(
    orderId: number,
    status: OrderStatusEnum,
  ): Promise<OrderModel> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);
    await order.update({ status });
    return order;
  }

  // ============================================================
  // PRIVATE — ORDER CREATION
  // ============================================================

  private async createFulfillmentOrder(
    checkoutSessionId: number,
    customerId: number,
    group: { vendorId: number; storeId: number; items: any[] },
    shippingAddress: AddressSnapshot,
    billingAddress: AddressSnapshot,
    t: Transaction,
  ): Promise<OrderModel> {
    const { vendorId, storeId, items } = group;

    const [vendor, store] = await Promise.all([
      this.vendorRepo.findById(vendorId, { transaction: t }),
      this.storeRepo.findById(storeId, { transaction: t }),
    ]);
    if (!vendor) throw new NotFoundException(`Vendor ${vendorId} not found`);
    if (!store) throw new NotFoundException(`Store ${storeId} not found`);
    if (store.vendor_id !== vendorId) {
      throw new BadRequestException(
        `Store ${storeId} does not belong to vendor ${vendorId}`,
      );
    }

    const variantIds = items.map((i) => i.variant_id);
    const variants = await this.variantRepo.findAll({
      where: { id: variantIds },
      include: [
        {
          model: ProductModel,
          as: 'product',
          include: [{ association: 'gallery_images' }],
        },
      ],
      transaction: t,
    });
    const variantMap = new Map(variants.map((v) => [v.id, v]));

    let subtotal = 0;
    let totalWeight = 0;
    const orderItemPayloads: any[] = [];
    const fulfillmentTypes = new Set<FulfillmentTypeEnum>();

    for (const item of items) {
      const variant = variantMap.get(item.variant_id);
      if (!variant)
        throw new NotFoundException(`Variant ${item.variant_id} not found`);
      if (variant.store_id !== storeId) {
        throw new BadRequestException(
          `Variant ${variant.id} does not belong to store ${storeId}`,
        );
      }

      const price = Number(variant.price);
      if (!Number.isFinite(price) || price <= 0) {
        throw new BadRequestException(
          `Variant ${variant.id} has no valid price`,
        );
      }

      const weight = Number(variant.weight) || 0;
      const itemTotal = round2(price * item.quantity);
      const fType = this.resolveFulfillmentType(variant);

      fulfillmentTypes.add(fType);
      subtotal += itemTotal;
      totalWeight += weight * item.quantity;

      const primaryImage =
        (variant as any).gallery?.find((m: any) => m.is_primary)?.url ??
        (variant as any).gallery?.[0]?.url ??
        null;

      orderItemPayloads.push({
        order_id: null,
        variant_id: variant.id,
        store_id: storeId,
        product_variant_snapshot: variant,
        attributes_snapshot: variant.metadata ?? {},
        sku_snapshot: variant.sku ?? '',
        image_url_snapshot: primaryImage,
        quantity: item.quantity,
        unit_price: moneyStr(price),
        total_price: moneyStr(itemTotal),
        weight_g_snapshot: weight,
        fulfillment_type: fType,
        status: OrderItemStatusEnum.PENDING,
        inventory_reservation_id: item.inventory_reservation?.id ?? null,
        service_booking_id: item.service_booking?.id ?? null,
      });
    }

    const shippingCost = this.calculateShipping(totalWeight, items.length);
    const taxAmount = round2(subtotal * TAX_RATE);
    const platformFee = round2(subtotal * PLATFORM_FEE_RATE);
    const total = round2(subtotal + taxAmount + shippingCost);

    const fulfillmentMode = this.resolveFulfillmentMode(
      fulfillmentTypes,
      store,
    );

    const order = await this.orderRepo.createWithTransaction(
      {
        checkout_session_id: checkoutSessionId,
        customer_id: customerId,
        vendor_id: vendorId,
        store_id: storeId,
        order_reference: this.generateOrderReference(),
        status: OrderStatusEnum.PENDING_PAYMENT,
        subtotal: moneyStr(subtotal),
        tax_amount: moneyStr(taxAmount),
        shipping_amount: moneyStr(shippingCost),
        handling_fee: '0.00',
        discount_amount: '0.00',
        platform_fee: moneyStr(platformFee),
        total_amount: moneyStr(total),
        amount_paid: '0.00',
        amount_refunded: '0.00',
        currency: CURRENCY,
        customer_snapshot: {
          id: customerId,
          name: (shippingAddress as any)?.name ?? 'Customer',
          email: (shippingAddress as any)?.email ?? 'unknown@example.com',
          phone: (shippingAddress as any)?.phone ?? '',
        },
        store_snapshot: {
          id: store.id,
          name: store.name ?? 'Store',
          vendor_name: vendor.business_name ?? 'Vendor',
          vendor_id: vendor.id,
        },
        shipping_address_snapshot: shippingAddress,
        billing_address_snapshot: billingAddress,
        fulfillment_mode: fulfillmentMode,
        version: 0,
      } as any,
      t,
    );

    for (const payload of orderItemPayloads) payload.order_id = order.id;
    await this.orderItemRepo.bulkCreateWithTransaction(orderItemPayloads, t);

    return order;
  }

  // ============================================================
  // PRIVATE — FULFILLMENT ON PAID
  // ============================================================

  private async applyFulfillmentOnPaid(
    item: OrderItemModel,
    t: Transaction,
  ): Promise<void> {
    switch (item.fulfillment_type) {
      case FulfillmentTypeEnum.PHYSICAL:
        if (item.inventory_reservation_id) {
          await this.reservationService.commitReservation(
            item.inventory_reservation_id,
            t,
          );
        }
        return;
      case FulfillmentTypeEnum.SERVICE:
        await this.confirmServiceBooking(item, t);
        return;
      case FulfillmentTypeEnum.DIGITAL:
        await this.createDigitalDelivery(item, t);
        return;
    }
  }

  private async confirmServiceBooking(
    item: OrderItemModel,
    t: Transaction,
  ): Promise<void> {
    if (!item.service_booking_id) return;
    const booking = await this.serviceBookingRepo.findById(
      item.service_booking_id,
      { transaction: t, lock: t.LOCK.UPDATE },
    );
    if (!booking) {
      throw new Error(
        `Order item ${item.id}: service booking ${item.service_booking_id} not found`,
      );
    }
    if (booking.status === BookingStatusEnum.CONFIRMED) return;
    await booking.update(
      { status: BookingStatusEnum.CONFIRMED },
      { transaction: t },
    );
  }

  private async cancelServiceBooking(
    item: OrderItemModel,
    t: Transaction,
  ): Promise<void> {
    if (!item.service_booking_id) return;
    const booking = await this.serviceBookingRepo.findById(
      item.service_booking_id,
      { transaction: t, lock: t.LOCK.UPDATE },
    );
    if (!booking) return;
    if (booking.status !== BookingStatusEnum.HELD) return;
    await booking.update(
      { status: BookingStatusEnum.CANCELLED },
      { transaction: t },
    );
  }

  private async createDigitalDelivery(
    item: OrderItemModel,
    t: Transaction,
  ): Promise<void> {
    await this.digitalDeliveryRepo.createWithTransaction(
      { order_item_id: item.id, status: 'pending' } as any,
      t,
    );
  }

  // ============================================================
  // PRIVATE — RESERVATION LINKING
  // ============================================================

  private async linkReservationsToOrderItems(
    orderId: number,
    reservationByVariantId: Map<number, InventoryReservationModel>,
    t: Transaction,
  ): Promise<void> {
    const items = await this.orderItemRepo.findAll({
      where: { order_id: orderId },
      transaction: t,
    });

    for (const item of items) {
      const reservation = reservationByVariantId.get(item.variant_id);
      if (reservation && !item.inventory_reservation_id) {
        await item.update(
          { inventory_reservation_id: reservation.id } as any,
          { transaction: t },
        );
      }
    }
  }

  private async checkOrderFulfillmentStatus(
    orderId: number,
    t: Transaction,
  ): Promise<void> {
    const items = await this.orderItemRepo.findAll({
      where: { order_id: orderId },
      transaction: t,
    });

    const allDone = items.every(
      (i) =>
        i.fulfilled_quantity >= i.quantity ||
        i.status === OrderItemStatusEnum.CANCELLED,
    );

    if (allDone) {
      await this.orderRepo.updateWithTransaction(
        orderId,
        { status: OrderStatusEnum.READY_FOR_PICKUP },
        t,
      );
    }
  }

  // ============================================================
  // PRIVATE — PAYMENT INIT FAILURE HANDLING
  // ============================================================

  /**
   * Called when payment initialization fails AFTER the checkout transaction
   * has committed. Releases all reservations and marks the session failed so
   * inventory is not stuck. Client can retry with a fresh idempotency key.
   */
  private async failCheckoutSafely(
    checkoutSessionId: number,
    reason: string,
  ): Promise<void> {
    try {
      await this.handlePaymentFailure(checkoutSessionId, reason, 'init_failed');
    } catch (err) {
      this.logger.error(
        `Failed to roll back checkout ${checkoutSessionId} after payment init error: ${(err as Error).message}`,
        (err as Error).stack,
      );
    }
  }

  // ============================================================
  // PRIVATE — CART LOADING / VALIDATION / GROUPING
  // ============================================================

  private async loadActiveCartForCheckout(
    customerId: number,
    t: Transaction,
  ): Promise<CartModel> {
    const cart = await this.cartRepo.lockActiveCart(customerId, t);
    if (!cart) {
      throw new BadRequestException('Cart is empty or already converted');
    }

    const hydrated = await this.cartRepo.findById(cart.id, {
      transaction: t,
      include: [
        {
          model: CartItemModel,
          as: 'items',
          include: [
            { model: InventoryReservationModel, as: 'inventory_reservation' },
            { model: ServiceBookingModel, as: 'service_booking' },
            {
              model: ProductVariantModel,
              as: 'variant',
              include: [{ model: ProductModel, as: 'product' }],
            },
            { model: StoreModel, as: 'store' },
          ],
        },
      ],
      subQuery: false,
    } as any);

    if (!hydrated?.items?.length) {
      throw new BadRequestException('Cart is empty or already converted');
    }

    return hydrated;
  }

  private validateCartReservations(cartItems: CartItemModel[]): void {
    const now = new Date();
    for (const item of cartItems) {
      if (item.item_type === FulfillmentTypeEnum.PHYSICAL) {
        const r = item.inventory_reservation;
        if (!r) {
          throw new BadRequestException(
            `Item ${item.variant_id} has no inventory reservation`,
          );
        }
        if (r.status !== ReservationStatusEnum.HELD) {
          throw new BadRequestException(
            `Item ${item.variant_id} reservation is no longer held`,
          );
        }
        if (r.expires_at && r.expires_at < now) {
          throw new BadRequestException(
            `Item ${item.variant_id} reservation expired`,
          );
        }
      }

      if (item.item_type === FulfillmentTypeEnum.SERVICE) {
        const b = item.service_booking;
        if (!b) {
          throw new BadRequestException(
            `Service item ${item.variant_id} has no booking`,
          );
        }
        if (b.status !== BookingStatusEnum.HELD) {
          throw new BadRequestException(
            `Service booking expired for variant ${item.variant_id}`,
          );
        }
      }
    }
  }

  private groupCartItemsByVendorAndStore(
    items: CartItemModel[],
  ): Array<{ vendorId: number; storeId: number; items: CartItemModel[] }> {
    const groups = new Map<string, CartItemModel[]>();
    for (const item of items) {
      const vendorId = item.variant?.vendor_id ?? item.store?.vendor_id;
      if (!vendorId) {
        throw new BadRequestException(
          `Cannot determine vendor for item ${item.id}`,
        );
      }
      const key = this.vendorStoreKey(vendorId, item.store_id);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(item);
    }
    return Array.from(groups.entries()).map(([key, groupItems]) => {
      const [vendorId, storeId] = key.split(':').map(Number);
      return { vendorId, storeId, items: groupItems };
    });
  }

  private groupItemsByVendorAndStore(
    items: OrderItemDto[],
  ): Array<{ vendorId: number; storeId: number; items: OrderItemDto[] }> {
    const groups = new Map<string, OrderItemDto[]>();
    for (const item of items) {
      const key = this.vendorStoreKey(item.vendor_id, item.store_id);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(item);
    }
    return Array.from(groups.entries()).map(([key, groupItems]) => {
      const [vendorId, storeId] = key.split(':').map(Number);
      return { vendorId, storeId, items: groupItems };
    });
  }

  private vendorStoreKey(vendorId: number, storeId: number): string {
    return `${vendorId}:${storeId}`;
  }

  // ============================================================
  // PRIVATE — PAYMENT
  // ============================================================

  private async initializePayment(
    session: CheckoutSessionModel,
    address: AddressSnapshot | null,
  ): Promise<string> {
    const customer = await this.customerService.findOne(session.customer_id);
    if (!customer) throw new NotFoundException('Customer not found');

    return this.paymentService.initializePayment(
      Number(session.total_amount),
      session.currency,
      {
        reference: session.checkout_reference,
        redirectUrl: `${process.env.APP_URL}/checkout/callback`,
        customer: {
          id: session.customer_id,
          email: customer.user?.email ?? 'customer@example.com',
          phone_number: customer.user?.phone_number ?? '',
          name: customer.user?.fullName ?? 'Customer',
        },
        metadata: {
          checkout_session_id: session.id,
          checkout_reference: session.checkout_reference,
          shipping_address: address,
        },
      },
    );
  }

  // ============================================================
  // PRIVATE — SMALL HELPERS
  // ============================================================

  private async getCustomerSessionIds(customerId: number): Promise<number[]> {
    const sessions = await this.checkoutSessionRepo.findAll({
      where: { customer_id: customerId },
      attributes: ['id'],
    });
    return sessions.map((s) => s.id);
  }

  private resolveFulfillmentType(
    variant: ProductVariantModel & { product?: ProductModel },
  ): FulfillmentTypeEnum {
    const productType = variant?.product?.product_type;
    if (productType === 'service') return FulfillmentTypeEnum.SERVICE;
    if (productType === 'digital') return FulfillmentTypeEnum.DIGITAL;
    return FulfillmentTypeEnum.PHYSICAL;
  }

  private resolveFulfillmentMode(
    types: Set<FulfillmentTypeEnum>,
    store: StoreModel,
  ): 'appointment' | 'digital' | 'delivery' | 'pickup' {
    if (types.has(FulfillmentTypeEnum.SERVICE)) return 'appointment';
    if (types.has(FulfillmentTypeEnum.DIGITAL)) return 'digital';
    const storeTypes = (store as any).fulfillment_types ?? [];
    return storeTypes.includes('delivery') ? 'delivery' : 'pickup';
  }

  private calculateShipping(totalWeightKg: number, itemCount: number): number {
    let cost = 5;
    if (totalWeightKg > 5) cost += Math.ceil(totalWeightKg / 5) * 2;
    if (itemCount > 10) cost += 5;
    return round2(cost);
  }

  private generateOrderReference(): string {
    const now = new Date();
    const datePart =
      `${now.getFullYear()}` +
      `${String(now.getMonth() + 1).padStart(2, '0')}` +
      `${String(now.getDate()).padStart(2, '0')}`;
    return `ORD-${datePart}-${nanoid(8).toUpperCase()}`;
  }

  private generateCheckoutReference(): string {
    const now = new Date();
    const datePart =
      `${now.getFullYear()}` +
      `${String(now.getMonth() + 1).padStart(2, '0')}` +
      `${String(now.getDate()).padStart(2, '0')}`;
    return `MKT-${datePart}-${nanoid(8).toUpperCase()}`;
  }

  private isEligibleForFulfillment(status: OrderStatusEnum): boolean {
    return (
      status === OrderStatusEnum.CONFIRMED ||
      status === OrderStatusEnum.PROCESSING
    );
  }

  private isCustomerCancellable(status: OrderStatusEnum): boolean {
    return (
      status === OrderStatusEnum.PENDING_PAYMENT ||
      status === OrderStatusEnum.CONFIRMED ||
      status === OrderStatusEnum.PROCESSING
    );
  }

  private async logStatusHistory(
    orderId: number,
    status: OrderStatusEnum,
    notes: string,
    actorType: string,
    actorId: number | null,
    t: Transaction,
  ): Promise<void> {
    await this.orderStatusHistoryRepo.createWithTransaction(
      {
        order_id: orderId,
        status,
        notes,
        actor_type: actorType,
        actor_id: actorId,
      } as any,
      t,
    );
  }

  // ============================================================
  // REVIEWS (stub)
  // ============================================================

  async addOrderItemReview(
    itemId: number,
    customerId: number,
    review: { rating: number; title?: string; content?: string },
  ): Promise<{ message: string }> {
    const item = await this.orderItemRepo.findById(itemId);
    if (!item) {
      throw new NotFoundException(`Order item ${itemId} not found`);
    }

    const order = await this.orderRepo.findById(item.order_id);
    if (!order) {
      throw new NotFoundException(`Order ${item.order_id} not found`);
    }
    const session = await this.checkoutSessionRepo.findById(
      order.checkout_session_id,
    );
    if (!session || session.customer_id !== customerId) {
      throw new NotFoundException(`Order item ${itemId} not found`);
    }

    this.logger.log(
      `Review received for item ${itemId} by customer ${customerId}: ${JSON.stringify(review)}`,
    );

    return { message: 'Review added successfully' };
  }

  // ============================================================
  // LOOKUPS
  // ============================================================

  async findOrderByReference(
    orderReference: string,
  ): Promise<OrderModel | null> {
    return this.orderRepo.findOne({
      where: { order_reference: orderReference },
    });
  }

  async findOrderByPaymentReference(
    paymentReference: string,
  ): Promise<OrderModel | null> {
    return this.orderRepo.findOne({
      include: [
        {
          model: CheckoutSessionModel,
          as: 'checkout_session',
          required: true,
          where: { payment_reference: paymentReference },
        },
      ],
    });
  }

  async findSessionByPaymentReference(
    paymentReference: string,
  ): Promise<CheckoutSessionModel | null> {
    return this.checkoutSessionRepo.findOne({
      where: { payment_reference: paymentReference },
    });
  }
}
