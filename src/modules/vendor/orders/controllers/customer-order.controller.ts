import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Req,
  ParseEnumPipe,
} from '@nestjs/common';
import { OrderService } from '../order.service';

import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/shared/dto/common/api.response';
import { OrderModel } from 'src/infrastructure';
import { CreateOrderDto, CreateOrderFromCartDto } from '../dto';
import { OrderStatusEnum } from 'src/shared';

@ApiTags('Orders')
@Controller('orders')
export class CustomerOrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @ApiSuccessResponse(OrderModel)
  async create(@Body() orderDto: CreateOrderDto): Promise<any> {
    return this.orderService.create(orderDto);
  }

  @Post('/from-cart')
  @ApiSuccessResponse(OrderModel)
  async createFromCart(
    // @Param('customerId', ParseIntPipe) customerId: number,
    @Req() req,
    @Body() orderDto: CreateOrderFromCartDto,
  ): Promise<OrderModel> {
    const customerId = req.user?.customer?.id;

    const { address_id } = orderDto;
    return this.orderService.createOrderFromCart(customerId, address_id);
  }

  @Get()
  @ApiSuccessResponse(OrderModel)
  findAll(
    @Query('customerId', ParseIntPipe) customerId?: number,
    @Query('status', new ParseEnumPipe(OrderStatusEnum))
    status?: OrderStatusEnum,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<{ orders: OrderModel[]; total: number }> {
    return this.orderService.findAllByCustomerId(
      customerId,
      status,
      page,
      limit,
    );
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
