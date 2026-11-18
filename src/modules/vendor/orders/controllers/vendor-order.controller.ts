// src/modules/order/controllers/vendor-order.controller.ts
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
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { OrderService } from '../order.service';
import { OrderItemModel, OrderModel } from 'src/infrastructure';
import { OrderStatusEnum } from 'src/shared';
import { VendorRepository } from 'src/infrastructure/database/repositories';

import {
  AddShipmentEventDto,
  FulfillOrderItemDto,
  ShipOrderDto,
  UpdateOrderStatusDto,
  VendorCancelOrderDto,
  VendorOrdersQueryDto,
} from '../dto';
import { assertUserOwnsVendor, AuthenticatedRequest } from 'src/modules/auth';
import { VendorJwtGuard } from 'src/shared/guards';
import { PermissionsGuard } from 'src/modules/user/permission/permissions.guard';
import { TokenAuthGuard } from 'src/modules/auth/token-auth.guard';

// ============================================================
// VENDOR ORDER CONTROLLER
// ============================================================
// Notes:
//   - A user can own multiple vendors. The path vendorId is verified
//     against ownership on every request.
//   - Ownership failures return 404 (not 403) to prevent ID enumeration.
//   - Status transitions are validated at the controller AND in the service.
// ============================================================

@ApiTags('Vendor · Orders')
@ApiBearerAuth()
// @UseGuards(VendorJwtGuard)
@UseGuards(TokenAuthGuard, PermissionsGuard)
@ApiParam({
  name: 'vendorId',
  type: Number,
  description: 'Vendor ID (must belong to the authenticated user)',
})
@Controller('vendors/:vendorId/orders')
export class VendorOrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly vendorRepo: VendorRepository,
  ) { }

  // ============================================================
  // STATISTICS
  // ============================================================

  @Get('stats')
  @ApiOperation({ summary: 'Aggregate stats for the vendor' })
  @ApiOkResponse({ description: 'Order statistics for the vendor' })
  async getStats(
    @Req() req: AuthenticatedRequest,
    @Param('vendorId', ParseIntPipe) vendorId: number,
  ) {
    await assertUserOwnsVendor(req, vendorId, this.vendorRepo);
    return this.orderService.getVendorStats(vendorId);
  }

  // ============================================================
  // LISTING / RETRIEVAL
  // ============================================================

  @Get()
  @ApiOperation({ summary: 'List orders for the vendor' })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatusEnum })
  @ApiOkResponse({ type: [OrderModel] })
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Query() query: VendorOrdersQueryDto,
  ) {
    await assertUserOwnsVendor(req, vendorId, this.vendorRepo);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const result = await this.orderService.findOrdersByVendor(
      vendorId,
      query.status,
      page,
      limit,
    );
    return {
      items: result.rows,

      meta: {
        count: result.count,
      },
    };
    // return {
    //   orders: result.rows,
    //   total: result.count,
    //   page,
    //   limit,
    //   total_pages: Math.ceil(result.count / limit),
    // };
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get a single order' })
  @ApiOkResponse({ type: OrderModel })
  @ApiResponse({ status: 404, description: 'Order not found for this vendor' })
  async findOne(
    @Req() req: AuthenticatedRequest,
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderModel> {
    await assertUserOwnsVendor(req, vendorId, this.vendorRepo);

    const order = await this.orderService.findOrderById(orderId);
    this.assertOrderBelongsToVendor(order, vendorId);
    return order;
  }

  // ============================================================
  // STATUS TRANSITIONS
  // ============================================================

  @Patch(':orderId/status')
  @ApiOperation({ summary: 'Update order status (validated transition)' })
  @ApiOkResponse({ type: OrderModel })
  async updateStatus(
    @Req() req: AuthenticatedRequest,
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<OrderModel> {
    await assertUserOwnsVendor(req, vendorId, this.vendorRepo);

    const order = await this.orderService.findOrderById(orderId);
    this.assertOrderBelongsToVendor(order, vendorId);
    this.assertStatusTransition(order.status, dto.status);

    return this.orderService.updateOrderStatus(orderId, dto.status);
  }

  @Patch(':orderId/fulfill')
  @ApiOperation({ summary: 'Start fulfillment (CONFIRMED → PROCESSING)' })
  @ApiOkResponse({ type: OrderModel })
  async fulfillOrder(
    @Req() req: AuthenticatedRequest,
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderModel> {
    await assertUserOwnsVendor(req, vendorId, this.vendorRepo);

    const order = await this.orderService.findOrderById(orderId);
    this.assertOrderBelongsToVendor(order, vendorId);

    return this.orderService.fulfillOrder(orderId);
  }

  @Patch(':orderId/ship')
  @ApiOperation({ summary: 'Mark shipped (PROCESSING → OUT_FOR_DELIVERY)' })
  @ApiOkResponse({ type: OrderModel })
  async shipOrder(
    @Req() req: AuthenticatedRequest,
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: ShipOrderDto,
  ): Promise<OrderModel> {
    await assertUserOwnsVendor(req, vendorId, this.vendorRepo);

    const order = await this.orderService.findOrderById(orderId);
    this.assertOrderBelongsToVendor(order, vendorId);

    return this.orderService.shipOrder(
      orderId,
      dto.tracking_number,
      dto.carrier,
    );
  }

  @Patch(':orderId/deliver')
  @ApiOperation({ summary: 'Mark delivered (OUT_FOR_DELIVERY → DELIVERED)' })
  @ApiOkResponse({ type: OrderModel })
  async deliverOrder(
    @Req() req: AuthenticatedRequest,
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderModel> {
    await assertUserOwnsVendor(req, vendorId, this.vendorRepo);

    const order = await this.orderService.findOrderById(orderId);
    this.assertOrderBelongsToVendor(order, vendorId);

    return this.orderService.deliverOrder(orderId);
  }

  @Patch(':orderId/complete')
  @ApiOperation({ summary: 'Mark completed (DELIVERED → COMPLETED)' })
  @ApiOkResponse({ type: OrderModel })
  async completeOrder(
    @Req() req: AuthenticatedRequest,
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderModel> {
    await assertUserOwnsVendor(req, vendorId, this.vendorRepo);

    const order = await this.orderService.findOrderById(orderId);
    this.assertOrderBelongsToVendor(order, vendorId);

    return this.orderService.completeOrder(orderId);
  }

  @Patch(':orderId/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiOkResponse({ type: OrderModel })
  async cancelOrder(
    @Req() req: AuthenticatedRequest,
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: VendorCancelOrderDto,
  ): Promise<OrderModel> {
    await assertUserOwnsVendor(req, vendorId, this.vendorRepo);

    const order = await this.orderService.findOrderById(orderId);
    this.assertOrderBelongsToVendor(order, vendorId);

    return this.orderService.cancelOrder(
      orderId,
      dto.reason,
      'vendor',
      vendorId,
    );
  }

  // ============================================================
  // ORDER ITEMS
  // ============================================================

  @Get(':orderId/items')
  @ApiOperation({ summary: 'List items in an order' })
  @ApiOkResponse({ type: [OrderItemModel] })
  async getOrderItems(
    @Req() req: AuthenticatedRequest,
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderItemModel[]> {
    await assertUserOwnsVendor(req, vendorId, this.vendorRepo);

    const order = await this.orderService.findOrderById(orderId);
    this.assertOrderBelongsToVendor(order, vendorId);

    return this.orderService.getOrderItemsByOrderId(orderId);
  }

  @Patch(':orderId/items/:itemId/fulfill')
  @ApiOperation({ summary: 'Fulfill a single order item (partial or full)' })
  @ApiOkResponse({ type: OrderItemModel })
  async fulfillOrderItem(
    @Req() req: AuthenticatedRequest,
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: FulfillOrderItemDto,
  ): Promise<OrderItemModel> {
    await assertUserOwnsVendor(req, vendorId, this.vendorRepo);

    const order = await this.orderService.findOrderById(orderId);
    this.assertOrderBelongsToVendor(order, vendorId);

    // Verify item belongs to this order
    const item = await this.orderService.getOrderItem(itemId);
    if (!item || item.order_id !== orderId) {
      throw new NotFoundException(
        `Item ${itemId} not found in order ${orderId}`,
      );
    }

    return this.orderService.fulfillOrderItem(itemId, dto.quantity);
  }

  // ============================================================
  // SHIPMENT EVENTS
  // ============================================================

  @Post(':orderId/shipments/:shipmentId/events')
  @ApiOperation({ summary: 'Attach a tracking event to a shipment' })
  @ApiResponse({ status: 201, description: 'Tracking event added' })
  async addShipmentEvent(
    @Req() req: AuthenticatedRequest,
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('shipmentId', ParseIntPipe) shipmentId: number,
    @Body() dto: AddShipmentEventDto,
  ) {
    await assertUserOwnsVendor(req, vendorId, this.vendorRepo);

    const order = await this.orderService.findOrderById(orderId);
    this.assertOrderBelongsToVendor(order, vendorId);

    // Ensure the shipment belongs to this order
    // const shipment = order.shipments?.find((s) => s.id === shipmentId);
    // if (!shipment) {
    //   throw new NotFoundException(
    //     `Shipment ${shipmentId} not found in order ${orderId}`,
    //   );
    // }

    // return this.orderService.addShipmentEvent(shipmentId, dto);
  }

  // ============================================================
  // PRIVATE HELPERS
  // ============================================================

  /**
   * Order ↔ vendor ownership. Returns 404 (not 403) to prevent enumeration.
   */
  private assertOrderBelongsToVendor(
    order: OrderModel | null,
    vendorId: number,
  ): void {
    if (!order || order.vendor_id !== vendorId) {
      throw new NotFoundException('Order not found');
    }
  }

  /**
   * Controller-level status transition validation.
   * The service does not enforce this; it accepts any status update.
   */
  private assertStatusTransition(
    current: OrderStatusEnum,
    next: OrderStatusEnum,
  ): void {
    const allowed: Partial<Record<OrderStatusEnum, OrderStatusEnum[]>> = {
      [OrderStatusEnum.PENDING_PAYMENT]: [
        OrderStatusEnum.PAYMENT_FAILED,
        OrderStatusEnum.CANCELLED,
      ],
      [OrderStatusEnum.PAYMENT_FAILED]: [OrderStatusEnum.CANCELLED],
      [OrderStatusEnum.CONFIRMED]: [
        OrderStatusEnum.PROCESSING,
        OrderStatusEnum.CANCELLED,
      ],
      [OrderStatusEnum.PROCESSING]: [
        OrderStatusEnum.READY_FOR_PICKUP,
        OrderStatusEnum.OUT_FOR_DELIVERY,
        OrderStatusEnum.CANCELLED,
      ],
      [OrderStatusEnum.READY_FOR_PICKUP]: [
        OrderStatusEnum.OUT_FOR_DELIVERY,
        OrderStatusEnum.COMPLETED,
        OrderStatusEnum.CANCELLED,
      ],
      [OrderStatusEnum.OUT_FOR_DELIVERY]: [
        OrderStatusEnum.DELIVERED,
        OrderStatusEnum.CANCELLED,
      ],
      [OrderStatusEnum.DELIVERED]: [
        OrderStatusEnum.COMPLETED,
        OrderStatusEnum.CANCELLED,
      ],
      [OrderStatusEnum.COMPLETED]: [],
      [OrderStatusEnum.CANCELLED]: [],
    };

    const valid = allowed[current] ?? [];
    if (!valid.includes(next)) {
      throw new BadRequestException(
        `Invalid transition from ${current} to ${next}. Allowed: ${valid.join(', ') || 'none'
        }.`,
      );
    }
  }
}
