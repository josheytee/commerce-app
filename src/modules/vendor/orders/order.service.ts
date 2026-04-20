import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { OrderSearchCriteria } from './order-search-criteria.interface';
import { PaymentService } from 'src/infrastructure/payment/payment.service';
import { CustomerService } from 'src/modules/user/customer/customer.service';
import { CartItemModel, OrderItemModel, OrderModel } from 'src/infrastructure';
import { CreateOrderDto } from './dto';
import { Sequelize } from 'sequelize-typescript';
import {
  FulfillmentRepository,
  OrderItemRepository,
  OrderRepository,
  VariantRepository,
} from 'src/infrastructure/database/repositories';
import { InventoryService } from '../inventory/inventory.service';
import { FulfillmentStatusEnum, OrderStatusEnum } from 'src/shared';
import { CartRepository } from 'src/infrastructure/database/repositories/cart.repository';
// import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly _paymentService: PaymentService,
    private readonly _customerService: CustomerService,
    private readonly _variantRepository: VariantRepository,
    private readonly _cartRepository: CartRepository,
    private readonly _inventoryService: InventoryService,
    private readonly _orderRepository: OrderRepository,
    private readonly _orderItemRepository: OrderItemRepository,
    private readonly _fulfillmentRepository: FulfillmentRepository,
    private readonly _sequelize: Sequelize,
  ) { }

  //   OrderService
  // - createFromCart()
  // - confirmOrder()
  // - cancelOrder()

  async create(
    customerId: number,
    items: any[],
    addressId: number,
    // paymentDetails: any,
  ): Promise<any> {
    const orderReference = this.generateOrderReference(customerId);
    let totalAmount = 0;
    // console.log('order_reference', orderReference);

    const order = await this._orderRepository.create({
      order_reference: orderReference,
      customer_id: customerId,
      address_id: addressId,
      status: OrderStatusEnum.PENDING,
      total_amount: totalAmount,
    });

    const orderItems = items.map((item) => {
      totalAmount += item.price * item.quantity;
      return {
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      };
    });

    await this._orderItemRepository.bulkCreate(orderItems);

    order.total_amount = totalAmount;

    // Process payment
    // const paymentResponse = await this._paymentService.initializePayment(
    //   totalAmount,
    //   paymentDetails.currency,
    //   paymentDetails.customerDetails,
    // );

    // if (paymentResponse.status !== 'success') {
    //   order.status = 'failed';
    // } else {
    //   order.status = 'completed';
    // }

    await order.save();
    const customer = await this._customerService.findOne(customerId);
    const paymentUrl = await this._paymentService.initializePayment(
      order.total_amount,
      'NGN',
      {
        refrence: order.order_reference,
        redirectUrl: '/orders/callback',
        customer: {
          id: customerId,
          email: customer.user.email,
          phonenumber: customer.user.phone_number,
          name: customer.user.first_name + ' ' + customer.user.last_name,
        },
      },
    );
    // return { order };
    return { order, paymentUrl };
  }

  async createOrderFromCart(cartId: number, addressId: number): Promise<any> {
    const cart = await this._cartRepository.findOne({ where: { id: cartId } });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return this._sequelize.transaction(async (t) => {
      let total = 0;

      const cartItems = cart.items as CartItemModel[];
      const orderItems = [];

      for (const item of cartItems) {
        const variant = await this._variantRepository.findById(
          item.product_variant_id,
        );

        // 🔥 reserve stock
        await this._inventoryService.reserve(
          item.product_variant_id,
          item.store_id,
          item.quantity,
        );

        total += variant.price * item.quantity;

        orderItems.push({
          product_variant_id: item.product_variant_id,
          quantity: item.quantity,
          price: variant.price,
          store_id: item.store_id,
        });
      }

      const order = await this._orderRepository.createWithTransaction(
        {
          order_reference: this.generateOrderReference(cart.customer_id),
          customer_id: cart.customer_id,
          address_id: addressId,
          total_amount: total,
          status: OrderStatusEnum.PENDING,
        },
        t,
      );

      await this._orderRepository.bulkCreateWithTransaction(
        orderItems.map((i) => ({ ...i, order_id: order.id })),
        t,
      );

      const paymentUrl =
        await this._paymentService.initializeOrderPayment(order);

      return { order, paymentUrl };
    });
  }

  async createOrder(dto: CreateOrderDto) {
    return this._sequelize.transaction(async (t) => {
      let total = 0;

      const items = [];

      for (const item of dto.items) {
        const variant = await this._variantRepository.findById(item.variant_id);

        // 🔥 reserve stock
        await this._inventoryService.reserve(item.variant_id, item.store_id, item.quantity);

        total += variant.price * item.quantity;

        items.push({
          product_variant_id: item.variant_id,
          quantity: item.quantity,
          price: variant.price,
          store_id: item.store_id,
        });
      }

      const order = await this._orderRepository.createWithTransaction(
        {
          order_reference: this.generateOrderReference(dto.customer_id),
          customer_id: dto.customer_id,
          total_amount: total,
          status: OrderStatusEnum.PENDING,
        },
        t,
      );

      await this._orderRepository.bulkCreateWithTransaction(
        items.map((i) => ({ ...i, order_id: order.id })),
        t,
      );

      //payment
      const customer = await this._customerService.findOne(dto.customer_id);
      const paymentUrl = await this._paymentService.initializePayment(
        order.total_amount,
        'NGN',
        {
          refrence: order.order_reference,
          redirectUrl: '/orders/callback',
          customer: {
            id: dto.customer_id,
            email: customer.user.email,
            phonenumber: customer.user.phone_number,
            name: customer.user.first_name + ' ' + customer.user.last_name,
          },
        },
      );

      return { order, paymentUrl };
    });
  }

  async handlePaymentCallback(data: any): Promise<void> {
    await this._paymentService.handleCallback('order', data);
  }

  // async processPayment(orderId: number, paymentMethod: string): Promise<any> {
  //   // Process payment
  //   const order = await this.orderModel.findByPk(orderId);
  //   if (!order) {
  //     throw new Error('OrderModel not found');
  //   }
  //   const paymentResponse = await this._paymentService.processPayment(
  //     orderId,
  //     paymentMethod,
  //   );
  //   return paymentResponse;
  // }

  async updateOrderStatus(
    orderId: number,
    status: OrderStatusEnum,
  ): Promise<OrderModel> {
    const order = await this._orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = status;
    await order.save();
    return order;
  }

  async cancelOrder(orderId: number) {
    const order = await this._orderRepository.findById(orderId, {
      include: ['orderItems'],
    });

    for (const item of order.orderItems) {
      await this._inventoryService.release(
        item.product_variant_id,
        item.store_id,
        item.quantity,
      );
    }

    await order.update({ status: OrderStatusEnum.CANCELLED });
  }

  async confirmOrder(orderId: number) {
    const order = await this._orderRepository.findById(orderId, {
      include: ['orderItems'],
    });

    for (const item of order.orderItems) {
      await this._inventoryService.confirm(
        item.product_variant_id,
        item.quantity,
      );
    }

    await order.update({ status: OrderStatusEnum.PAID });

    await this.createFulfillments(order);
  }

  async createFulfillments(order: OrderModel) {
    const grouped = {};

    for (const item of order.orderItems) {
      if (!grouped[item.store_id]) {
        grouped[item.store_id] = [];
      }
      grouped[item.store_id].push(item);
    }

    for (const storeId of Object.keys(grouped)) {
      const fulfillment = await this._fulfillmentRepository.create({
        order_id: order.id,
        store_id: Number(storeId),
        status: FulfillmentStatusEnum.PENDING,
      });

      const items = grouped[storeId];

      await this._fulfillmentRepository.bulkCreate(
        items.map((item) => ({
          fulfillment_id: fulfillment.id,
          order_item_id: item.id,
          quantity: item.quantity,
        })),
      );
    }
  }

  generateOrderReference(customerId: number | string): string {
    // Step 1: Define a static prefix
    const prefix = 'ORD';

    // Step 2: Get the current date in YYYYMMDD format
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ensure two digits
    const day = ('0' + date.getDate()).slice(-2); // Ensure two digits
    const dateString = `${year}${month}${day}`;

    // Step 3: Generate a random alphanumeric string
    const randomString = Math.random().toString(36).substr(2, 6).toUpperCase();

    // Step 4: Concatenate all parts to form the order reference
    const orderReference = `${prefix}|${customerId}|${dateString}|${randomString}`;

    return orderReference;
  }

  async findAllByVendorId(id: number): Promise<OrderModel[]> {
    try {
      // Validate input
      if (!id || id <= 0) {
        throw new BadRequestException('Invalid vendor ID');
      }

      // Direct query through associations
      const stores = await this._orderRepository.findAllByVendorId(id);
      console.log('stores', stores);
      console.log(`Found ${stores.orders.length} stores for vendor ID: ${id}`);

      return stores.orders;
    } catch (error) {
      console.error(`Error finding stores for vendor ${id}:`, error.message);
      throw new InternalServerErrorException('Failed to retrieve stores');
    }
  }

  async findOneByVendorId(vendorId: number, id: number): Promise<OrderModel> {
    try {
      // Validate input
      if (!id || id <= 0) {
        throw new BadRequestException('Invalid vendor ID');
      }

      // Direct query through associations
      const stores = await this._orderRepository.findOneByVendorId(
        vendorId,
        id,
      );

      return stores;
    } catch (error) {
      console.error(`Error finding stores for vendor ${id}:`, error.message);
      throw new InternalServerErrorException('Failed to retrieve stores');
    }
  }

  async findOneByCriteria(criteria: OrderSearchCriteria): Promise<OrderModel> {
    // Build where clause dynamically based on criteria
    const where: any = {};

    if (criteria.id) {
      where.id = criteria.id;
    }
    if (criteria.orderReference) {
      where.order_number = criteria.orderReference;
    }
    // if (criteria.userId) {
    //   where.user_id = criteria.userId;
    // }
    // if (criteria.status) {
    //   where.status = criteria.status;
    // }
    // if (criteria.paymentStatus) {
    //   where.payment_status = criteria.paymentStatus;
    // }
    // if (criteria.email) {
    //   where.email = criteria.email;
    // }
    // if (criteria.phone) {
    //   where.phone = criteria.phone;
    // }

    const order = await this._orderRepository.findOne({
      where,
      include: [
        {
          model: OrderItemModel,
          as: 'items',
          required: false,
        },
      ],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
