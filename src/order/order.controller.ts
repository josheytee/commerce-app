import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './models/order.model';
import { OrderItem } from './models/order-item.model';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(
    @Body() data: { order: Partial<Order>; items: Partial<OrderItem>[] },
  ): Promise<Order> {
    return this.orderService.create(data.order, data.items);
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
