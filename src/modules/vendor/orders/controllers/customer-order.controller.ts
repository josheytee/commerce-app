import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from '../order.service';

import { ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/shared/dto/common/api.response';
import { OrderModel } from 'src/infrastructure';

@ApiTags('Customer - Orders')
@Controller('customers/:customerId/orders')
export class CustomerOrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @ApiSuccessResponse(OrderModel)
  async create(@Body() orderDto: any) {
    const { customer_id, items } = orderDto;
    return this.orderService.create(customer_id, items);
  }

  @Get()
  @ApiSuccessResponse(OrderModel)
  findAll(
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<OrderModel[]> {
    return this.orderService.findAllByVendorId(customerId);
  }

  @Get(':id')
  @ApiSuccessResponse(OrderModel)
  findOne(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderModel> {
    return this.orderService.findOneByVendorId(customerId, id);
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
