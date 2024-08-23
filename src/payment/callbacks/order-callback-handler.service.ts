import { Injectable } from '@nestjs/common';
import { OrderService } from 'src/order/order.service';
import { CallbackHandler } from 'src/payment/interfaces/callback-handler.interface';

@Injectable()
export class OrderCallbackHandlerService implements CallbackHandler {
  constructor(private readonly orderService: OrderService) {}

  async handleCallback(data: any): Promise<void> {
    const { transactionId, status } = data;
    // Validate payment and update order status
    const order = await this.orderService.find({
      orderReference: transactionId,
    });
    if (order) {
      order.status = status === 'completed' ? 'paid' : 'failed';
      await order.save();
    }
  }
}
