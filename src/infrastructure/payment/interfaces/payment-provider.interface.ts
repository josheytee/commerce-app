// src/payment/interfaces/payment-provider.interface.ts
export interface PaymentProvider {
  initializePayment(
    amount: number,
    currency: string,
    metadata?: any,
  ): Promise<string>;
  verifyPayment(reference: string): Promise<boolean>;
  handlePaymentCallback(module: string, data: any): Promise<void>;
}
