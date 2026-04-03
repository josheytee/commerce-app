import { Injectable } from '@nestjs/common';
import { CallbackHandler } from '../interfaces/callback-handler.interface';
import { OrderService } from 'src/modules/vendor/orders/order.service';

@Injectable()
export class OrderCallbackHandlerService implements CallbackHandler {
  constructor(private readonly orderService: OrderService) { }

  async handleCallback(data: any): Promise<void> {
    const { transactionId, status } = data;
    // Validate payment and update order status
    const order = await this.orderService.findOneByCriteria({
      orderReference: transactionId,
    });
    if (order) {
      order.status = status === 'completed' ? 'paid' : 'failed';
      await order.save();
    }
  }
}
