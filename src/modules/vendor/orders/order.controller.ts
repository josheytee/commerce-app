import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';

import { ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/shared/dto/common/api.response';
import { OrderModel, OrderItemModel } from 'src/infrastructure';

@ApiTags('Vendor - Orders')
@Controller('vendors/:vendorId/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  // @Post()
  // @ApiSuccessResponse(OrderModel)
  // async create(@Body() orderDto: any) {
  //   const { customer_id, items } = orderDto;
  //   return this.orderService.create(customer_id, items);
  // }

  @Post('callback')
  async handlePaymentCallback(
    @Query() query: { transaction_id: string; tx_ref: string; status: string },
  ) {
    await this.orderService.handlePaymentCallback(query);
    return { message: 'Callback handled successfully' };
  }

  @Post('update-status/:orderId')
  @ApiSuccessResponse(OrderModel)
  async updateOrderStatus(
    @Param('orderId') orderId: number,
    @Body() updateDto: any,
  ) {
    const { status } = updateDto;
    return this.orderService.updateOrderStatus(orderId, status);
  }

  @Get()
  @ApiSuccessResponse(OrderModel)
  findAll(
    @Param('vendorId', ParseIntPipe) vendorId: number,
  ): Promise<OrderModel[]> {
    return this.orderService.findAllByVendorId(vendorId);
  }

  @Get(':id')
  @ApiSuccessResponse(OrderModel)
  findOne(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderModel> {
    return this.orderService.findOneByVendorId(vendorId, id);
  }

  // @Patch(':id')
  // @ApiSuccessResponse(OrderModel)
  // update(
  //   @Param('id') id: number,
  //   @Body()
  //   data: { order: Partial<OrderModel>; items: Partial<OrderItemModel>[] },
  // ): Promise<OrderModel> {
  //   return this.orderService.update(id, data.order, data.items);
  // }

  // @Delete(':id')
  // @ApiSuccessResponse(OrderModel)
  // remove(@Param('id') id: number): Promise<void> {
  //   return this.orderService.remove(id);
  // }
}
