// src/infrastructure/payment/callbacks/order-callback-handler.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CallbackHandler } from '../interfaces/callback-handler.interface';
import { OrderService } from 'src/modules/vendor/orders/order.service';
import { PaymentProviderEnum } from 'src/shared';

@Injectable()
export class OrderCallbackHandlerService implements CallbackHandler {
  private readonly logger = new Logger(OrderCallbackHandlerService.name);

  constructor(private readonly orderService: OrderService) { }

  async handleCallback(data: {
    transactionId: string;
    status: 'successful' | 'completed' | 'failed' | 'cancelled' | string;
    checkoutSessionId?: number;
    reason?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const { transactionId, status, reason } = data;

    // Fast path — the provider usually echoes our metadata back
    const checkoutSessionId =
      data.checkoutSessionId ?? data.metadata?.checkout_session_id;

    if (checkoutSessionId) {
      await this.dispatchBySession(
        Number(checkoutSessionId),
        transactionId,
        status,
        reason,
      );
      return;
    }

    // Fallback — look up by payment reference
    const order =
      await this.orderService.findOrderByPaymentReference(transactionId);
    if (!order) {
      this.logger.warn(
        `Callback received for unknown payment reference ${transactionId}`,
      );
      return;
    }

    await this.dispatchBySession(
      order.checkout_session_id,
      transactionId,
      status,
      reason,
    );
  }

  private async dispatchBySession(
    checkoutSessionId: number,
    paymentReference: string,
    status: string,
    reason?: string,
  ): Promise<void> {
    if (
      status === 'successful' ||
      status === 'completed' ||
      status === 'paid'
    ) {
      await this.orderService.confirmCheckoutPayment(
        checkoutSessionId,
        paymentReference,
        PaymentProviderEnum.FLUTTERWAVE
      );
      return;
    }

    if (
      status === 'failed' ||
      status === 'cancelled' ||
      status === 'canceled'
    ) {
      await this.orderService.handlePaymentFailure(
        checkoutSessionId,
        reason ?? `Payment provider reported status: ${status}`,
      );
      return;
    }

    this.logger.warn(
      `Unhandled payment status "${status}" for session ${checkoutSessionId}`,
    );
  }
}
