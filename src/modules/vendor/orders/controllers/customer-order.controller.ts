// src/modules/order/controllers/customer-order.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { OrderService } from '../order.service';
import {
  CheckoutSessionModel,
  OrderItemModel,
  OrderModel,
} from 'src/infrastructure';
import { OrderStatusEnum } from 'src/shared';

import {
  CancelOrderDto,
  CreateOrderDirectDto,
  CreateOrderFromCartDto,
  CreateOrderItemReviewDto,
  PaginationQueryDto,
  RequestCancellationDto,
  SearchOrdersQueryDto,
} from '../dto';
import { CustomerJwtGuard } from 'src/shared/guards';
import { AuthenticatedRequest, requireCustomerId } from 'src/modules/auth';
import { CustomerJwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@ApiTags('Customer · Orders')
@ApiBearerAuth()
@UseGuards(CustomerJwtAuthGuard)
@Controller('orders')
export class CustomerOrderController {
  constructor(private readonly orderService: OrderService) { }

  // ============================================================
  // CHECKOUT CREATION
  // ============================================================

  @Post('checkout/from-cart')
  @ApiOperation({
    summary: 'Create a checkout session from the active cart',
    description:
      'Groups cart items by vendor+store, creates fulfillment orders, returns a payment URL. Safe to retry with the same idempotency_key.',
  })
  @ApiResponse({ status: 201, type: CheckoutSessionModel })
  async createFromCart(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateOrderFromCartDto,
  ): Promise<{
    checkout_session: CheckoutSessionModel;
    orders: OrderModel[];
    payment_url: string | null;
  }> {
    const customerId = requireCustomerId(req);
    console.log(customerId, dto, 'customerId')
    return this.orderService.createCheckoutFromCart(
      customerId,
      dto.shipping_address_id,
      dto.idempotency_key,
    );
  }

  @Post('checkout/direct')
  @ApiOperation({
    summary: 'Create a checkout session from an explicit item list (buy now)',
  })
  @ApiResponse({ status: 201, type: CheckoutSessionModel })
  async createDirect(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateOrderDirectDto,
  ): Promise<{
    checkout_session: CheckoutSessionModel;
    orders: OrderModel[];
    payment_url: string;
  }> {
    const customerId = requireCustomerId(req);
    // Force customer_id to the authenticated user — never trust the body
    return this.orderService.createCheckoutFromItems({
      ...dto,
      items: dto.items as never,
      customer_id: customerId,
    });
  }

  // ============================================================
  // RETRIEVAL
  // ============================================================

  @Get()
  @ApiOperation({ summary: "List the authenticated customer's orders" })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatusEnum })
  @ApiOkResponse({ description: 'Paginated list of orders' })
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query() query: PaginationQueryDto,
  ): Promise<{
    orders: OrderModel[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> {
    const customerId = requireCustomerId(req);
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const result = await this.orderService.findOrdersByCustomer(
      customerId,
      query.status,
      page,
      limit,
    );

    return {
      orders: result.rows,
      total: result.count,
      page,
      limit,
      total_pages: Math.ceil(result.count / limit),
    };
  }

  @Get('search')
  @ApiOperation({ summary: "Search the customer's orders" })
  @ApiOkResponse({ type: [OrderModel] })
  async search(
    @Req() req: AuthenticatedRequest,
    @Query() query: SearchOrdersQueryDto,
  ): Promise<OrderModel[]> {
    const customerId = requireCustomerId(req);
    return this.orderService.searchCustomerOrders(customerId, {
      status: query.status,
      orderReference: query.order_reference,
    });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Aggregate order statistics for the customer' })
  @ApiOkResponse({ description: 'Order summary statistics' })
  async getSummary(@Req() req: AuthenticatedRequest) {
    const customerId = requireCustomerId(req);
    return this.orderService.getCustomerOrderSummary(customerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order' })
  @ApiOkResponse({ type: OrderModel })
  @ApiResponse({
    status: 404,
    description: 'Order not found for this customer',
  })
  async findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderModel> {
    const customerId = requireCustomerId(req);
    // findOneByCustomerId enforces ownership — no extra check needed
    return this.orderService.findOneByCustomerId(customerId, id);
  }

  @Get(':id/tracking')
  @ApiOperation({ summary: 'Get shipment tracking for an order' })
  @ApiOkResponse({
    description: 'Shipment timeline for the order',
  })
  async getTracking(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const customerId = requireCustomerId(req);
    return this.orderService.getOrderTracking(customerId, id);
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  @Patch(':id/cancel')
  @ApiOperation({
    summary: 'Cancel the order immediately',
    description:
      'Only allowed for PENDING_PAYMENT, CONFIRMED, or PROCESSING orders. For later states, use request-cancel.',
  })
  @ApiOkResponse({ type: OrderModel })
  async cancelOrder(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CancelOrderDto,
  ): Promise<OrderModel> {
    const customerId = requireCustomerId(req);

    // Ownership check — throws 404 if not theirs
    const order = await this.orderService.findOneByCustomerId(customerId, id);
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    return this.orderService.cancelOrder(
      id,
      dto.reason,
      'customer',
      customerId,
    );
  }

  @Patch(':id/request-cancel')
  @ApiOperation({
    summary: 'Request cancellation for vendor approval',
    description:
      'Use when the order is beyond immediate cancel (e.g. already shipped).',
  })
  @ApiOkResponse({
    description: 'Cancellation request submitted',
  })
  async requestCancellation(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RequestCancellationDto,
  ): Promise<{ message: string; request_id: string }> {
    const customerId = requireCustomerId(req);

    const order = await this.orderService.findOneByCustomerId(customerId, id);
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    return this.orderService.requestOrderCancellation(
      id,
      customerId,
      dto.reason,
    );
  }

  @Post(':id/retry-payment')
  @ApiOperation({ summary: 'Retry payment for an unpaid checkout' })
  @ApiOkResponse({
    description: 'Payment URL for the retry',
    schema: { example: { payment_url: 'https://...' } },
  })
  async retryPayment(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ payment_url: string }> {
    const customerId = requireCustomerId(req);

    // Verify order belongs to customer before retrying
    const order = await this.orderService.findOneByCustomerId(customerId, id);
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    // retryPayment operates on the checkout session, not the order
    return this.orderService.retryPayment(order.checkout_session_id);
  }

  // ============================================================
  // ORDER ITEMS
  // ============================================================

  @Get(':id/items')
  @ApiOperation({ summary: 'List order items' })
  @ApiOkResponse({ type: [OrderItemModel] })
  async getOrderItems(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderItemModel[]> {
    const customerId = requireCustomerId(req);

    const order = await this.orderService.findOneByCustomerId(customerId, id);
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    return this.orderService.getOrderItemsByOrderId(id);
  }

  @Get(':id/items/:itemId')
  @ApiOperation({ summary: 'Get a single order item' })
  @ApiOkResponse({ type: OrderItemModel })
  async getOrderItem(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<OrderItemModel> {
    const customerId = requireCustomerId(req);

    // Verify ownership via parent order
    const order = await this.orderService.findOneByCustomerId(customerId, id);
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    const item = await this.orderService.getOrderItem(itemId);
    if (!item || item.order_id !== id) {
      throw new NotFoundException(`Item ${itemId} not found in order ${id}`);
    }

    return item;
  }

  // ============================================================
  // REVIEWS
  // ============================================================

  @Post(':id/items/:itemId/review')
  @ApiOperation({ summary: 'Review a delivered order item' })
  @ApiResponse({ status: 201, description: 'Review added' })
  async addReview(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: CreateOrderItemReviewDto,
  ): Promise<{ message: string }> {
    const customerId = requireCustomerId(req);

    const order = await this.orderService.findOneByCustomerId(customerId, id);
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    if (
      order.status !== OrderStatusEnum.DELIVERED &&
      order.status !== OrderStatusEnum.COMPLETED
    ) {
      throw new BadRequestException(
        'Order must be delivered or completed before reviewing',
      );
    }

    // Ensure item belongs to this order
    const item = await this.orderService.getOrderItem(itemId);
    if (!item || item.order_id !== id) {
      throw new NotFoundException(`Item ${itemId} not found in order ${id}`);
    }

    return this.orderService.addOrderItemReview(itemId, customerId, {
      rating: dto.rating,
      title: dto.title,
      content: dto.content,
    });
  }
}
