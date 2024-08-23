// src/payment/providers/flutterwave_payment_provider.ts
import fetch from 'node-fetch';
import { PaymentProvider } from '../interfaces/payment-provider.interface';
import { ConfigService } from '@nestjs/config';
import { OrderService } from 'src/order/order.service';
import { Inject } from '@nestjs/common';
import { CallbackHandler } from '../interfaces/callback-handler.interface';
import { OrderCallbackHandlerService } from '../callbacks/order-callback-handler.service';

export class FlutterwavePaymentProvider implements PaymentProvider {
  private readonly baseUrl = 'https://api.flutterwave.com/v3';
  private readonly secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  private readonly secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
  private readonly redirectUrl = process.env.REDIRECT_URL;
  private readonly callbackHandlers: Map<string, CallbackHandler> = new Map();

  constructor(
    private readonly configService: ConfigService,
    private readonly orderCallbackHandler: OrderCallbackHandlerService,
  ) {
    // this.secretHash = this.configService.get<string>('FLUTTERWAVE_SECRET_HASH');
    // this.secretKey = this.configService.get<string>('FLUTTERWAVE_SECRET_KEY');
    this.callbackHandlers.set('order', this.orderCallbackHandler);
  }

  async initializePayment(
    amount: number,
    currency: string,
    metadata: any,
  ): Promise<any> {
    const response = await fetch(`${this.baseUrl}/payments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: metadata.reference || `tx-${Date.now()}`,
        amount,
        currency,
        redirect_url: metadata.redirectUrl || this.redirectUrl,
        customer: {
          email: metadata.customer.email,
          phonenumber: metadata.customer.phone,
          name: metadata.customer.name,
        },
        meta: {
          customer_id: metadata.customer.id,
        },
      }),
    });

    // console.log('na we be this', this.secretKey, response);
    if (!response.ok) {
      throw new Error('Failed to initialize payment');
    }

    return response.json();
  }
  async handlePaymentCallback(module, queryParams: any): Promise<void> {
    const handler = this.callbackHandlers.get(module);
    if (handler) {
      await handler.handleCallback(queryParams);
    } else {
      throw new Error(`No callback handler registered for module: ${module}`);
    }
  }

  async verifyPayment(transactionId: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/transactions/${transactionId}/verify`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }

    return response.json();
  }
}
