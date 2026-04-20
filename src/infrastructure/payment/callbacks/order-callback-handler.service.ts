import { Injectable } from '@nestjs/common';
import { CallbackHandler } from '../interfaces/callback-handler.interface';
import { OrderService } from 'src/modules/vendor/orders/order.service';
import { OrderStatusEnum } from 'src/shared';

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
      order.status = status === 'completed' ? OrderStatusEnum.PAID : OrderStatusEnum.FAILED;
      await order.save();
    }
  }
}
