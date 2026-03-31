// src/payment/payment.controller.ts
import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('initialize')
  async initializePayment(@Body() paymentDto: any) {
    console.log('Received payment initialization request:', paymentDto);
    const { amount, currency, ...customerDetails } = paymentDto;
    return this.paymentService.initializePayment(
      amount,
      currency,
      customerDetails,
    );
  }
  @Get('callback')
  async handleFlutterwaveCallback(@Query() queryParams: any): Promise<void> {
    await this.paymentService.handlePaymentCallback('order', queryParams);
  }

  @Post('verify/:transactionId')
  async verifyPayment(@Param('transactionId') transactionId: string) {
    return this.paymentService.verifyPayment(transactionId);
  }
}
