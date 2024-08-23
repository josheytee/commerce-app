// src/payment/payment.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { PaymentProvider } from './interfaces/payment-provider.interface';
import { ConfigService } from '@nestjs/config';
import { FlutterwavePaymentProvider } from './providers/flutterwave.provider';

@Injectable()
export class PaymentService {
  private readonly secretHash: string;
  // private readonly callbackHandlers: Map<string, CallbackHandler> = new Map();

  constructor(
    @Inject('FLUTTERWAVE_PAYMENT_PROVIDER')
    private readonly paymentProvider: FlutterwavePaymentProvider,
    // private readonly configService: ConfigService,
  ) {
    console.log('PaymentProvider:', this.paymentProvider);
    // console.log('ConfigService:', this.configService);
    // this.secretHash = this.configService.get<string>('FLUTTERWAVE_SECRET_HASH');
    // this.callbackHandlers.set('order', this.orderCallbackHandler);
    // this.callbackHandlers.set('inventory', this.inventoryCallbackHandler);
  }

  async initializePayment(
    amount: number,
    currency: string,
    metaData: any,
  ): Promise<any> {
    return this.paymentProvider.initializePayment(amount, currency, metaData);
  }

  async handleCallback(module: string, data: any): Promise<void> {
    this.paymentProvider.handlePaymentCallback(module, data);
  }

  async handlePaymentCallback(module: string, queryParams: any): Promise<void> {
    return this.paymentProvider.handlePaymentCallback(module, queryParams);
  }

  async verifyPayment(transactionId: string): Promise<any> {
    return this.paymentProvider.verifyPayment(transactionId);
  }
}
