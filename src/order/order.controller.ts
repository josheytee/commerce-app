import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './models/order.model';
import { OrderItem } from './models/order-item.model';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() orderDto: any) {
    const { customer_id, items } = orderDto;
    return this.orderService.create(customer_id, items);
  }

  @Post('callback')
  async handlePaymentCallback(
    @Query() query: { transaction_id: string; tx_ref: string; status: string },
  ) {
    await this.orderService.handlePaymentCallback(query);
    return { message: 'Callback handled successfully' };
  }

  @Post('update-status/:orderId')
  async updateOrderStatus(
    @Param('orderId') orderId: number,
    @Body() updateDto: any,
  ) {
    const { status } = updateDto;
    return this.orderService.updateOrderStatus(orderId, status);
  }

  @Get()
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() data: { order: Partial<Order>; items: Partial<OrderItem>[] },
  ): Promise<Order> {
    return this.orderService.update(id, data.order, data.items);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.orderService.remove(id);
  }
}
