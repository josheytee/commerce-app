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
import { ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/api.response';

@Controller('orders')
@ApiTags('Orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @ApiSuccessResponse(Order)
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
  @ApiSuccessResponse(Order)
  async updateOrderStatus(
    @Param('orderId') orderId: number,
    @Body() updateDto: any,
  ) {
    const { status } = updateDto;
    return this.orderService.updateOrderStatus(orderId, status);
  }

  @Get()
  @ApiSuccessResponse(Order)
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  @ApiSuccessResponse(Order)
  findOne(@Param('id') id: number): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @ApiSuccessResponse(Order)
  update(
    @Param('id') id: number,
    @Body() data: { order: Partial<Order>; items: Partial<OrderItem>[] },
  ): Promise<Order> {
    return this.orderService.update(id, data.order, data.items);
  }

  @Delete(':id')
  @ApiSuccessResponse(Order)
  remove(@Param('id') id: number): Promise<void> {
    return this.orderService.remove(id);
  }
}
