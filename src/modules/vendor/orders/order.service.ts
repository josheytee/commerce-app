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
import {
  CartItemModel,
  OrderItemModel,
  OrderModel,
  ProductModel,
  StoreModel,
} from 'src/infrastructure';
import { CreateOrderDto, OrderItemDto } from './dto';
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
import { VendorRepository } from '../onboarding/vendor.repository';
// import { PaymentService } from 'src/payment/payment.service';

// {
//   "customer_id": 142,
//   "items": [
//     {
//       "variant_id": 618,
//       "quantity": 2,
//       "store_id": 49,
//       "vendor_id": 8,
//       "product_id": 251
//     }
//   ],
//   "address_id": 3
// }
@Injectable()
export class OrderService {
  constructor(
    private readonly _paymentService: PaymentService,
    private readonly _customerService: CustomerService,
    private readonly _variantRepository: VariantRepository,
    private readonly _cartRepository: CartRepository,
    private readonly _inventoryService: InventoryService,
    private readonly _orderRepository: OrderRepository,
    private readonly _vendorRepository: VendorRepository,
    private readonly _orderItemRepository: OrderItemRepository,
    private readonly _fulfillmentRepository: FulfillmentRepository,
    private readonly _sequelize: Sequelize,
  ) { }

  //   OrderService
  // - createFromCart()
  // - confirmOrder()
  // - cancelOrder()

  /**
   * Group items by vendor for multi-vendor orders
   */
  private groupItemsByVendor(
    items: OrderItemDto[],
  ): Map<number, OrderItemDto[]> {
    const grouped = new Map<number, OrderItemDto[]>();

    items.forEach((item) => {
      const vendorId = item.vendor_id;
      if (!grouped.has(vendorId)) {
        grouped.set(vendorId, []);
      }
      grouped.get(vendorId)!.push(item);
    });

    return grouped;
  }

  /**
   * Calculate shipping cost for a vendor's items
   */
  private calculateShippingCost(
    vendorId: number,
    items: OrderItemDto[],
    shippingMethod: string = 'standard',
  ): number {
    // Base shipping rates
    const shippingRates = {
      standard: 0,
      express: 12.0,
      same_day: 25.0,
    };

    // Calculate based on items weight or quantity
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const baseRate = shippingRates[shippingMethod] || 0;

    // Additional cost for bulky items (if weight info is available)
    // This is a simplified example
    let additionalCost = 0;
    if (totalItems > 5) {
      additionalCost = 2.0;
    }

    return baseRate + additionalCost;
  }

  /**
   * Create a multi-vendor order
   */
  async create(createOrderDto: CreateOrderDto): Promise<{
    // order: OrderModel;
    vendorOrders: OrderModel[];
    paymentUrl: string;
  }> {
    const { customer_id, items, address_id } = createOrderDto;
    const shipping_method = 'standard';
    const coupon_code = '';

    // Validate input
    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // Group items by vendor
    const vendorGroups = this.groupItemsByVendor(items);
    const vendorIds = Array.from(vendorGroups.keys());

    // Validate all vendors exist
    const vendors = await this._vendorRepository.getVendorsById(vendorIds);

    if (vendors.length !== vendorIds.length) {
      throw new NotFoundException('One or more vendors not found');
    }

    // Create a main order (parent order)
    const orderReference = this.generateOrderReference(customer_id);
    let totalAmount = 0;
    const vendorOrders: OrderModel[] = [];

    // Create main order
    // const mainOrder = await this._orderRepository.create({
    //   order_reference: orderReference,
    //   customer_id,
    //   address_id,
    //   status: OrderStatusEnum.PENDING,
    //   total_amount: 0, // Will be updated after vendor orders
    //   // shipping_method,
    //   // coupon_code,
    // });

    // Process each vendor's items
    for (const [vendorId, vendorItems] of vendorGroups) {
      const vendor = vendors.find((v) => v.id === vendorId);
      const vendorOrderReference = `${orderReference}-V${vendorId}`;

      // Create vendor-specific order (sub-order)
      const vendorOrder = await this._orderRepository.create({
        order_reference: vendorOrderReference,
        customer_id,
        address_id,
        vendor_id: vendorId,
        // parent_order_id: mainOrder.id,
        status: OrderStatusEnum.PENDING,
        total_amount: 0,
        // shipping_method,
        // is_multi_vendor: false,
        // vendor_name: vendor.business_name,
      });

      // Fetch variants for this vendor's items
      const variantIds = vendorItems.map((item) => item.variant_id);
      const variants = await this._variantRepository.findAll({
        where: { id: variantIds },
        include: [
          {
            model: ProductModel,
            as: 'product',
            attributes: ['id', 'base_price', 'name', 'vendor_id'],
          },
        ],
      });

      // Create a map for quick variant lookup
      const variantMap = new Map(variants.map((v) => [v.id, v]));

      // Prepare order items
      const orderItemsData = vendorItems.map((item: OrderItemDto) => {
        const variant = variantMap.get(item.variant_id);
        if (!variant) {
          throw new BadRequestException(
            `Variant with ID ${item.variant_id} not found`,
          );
        }

        // Check if variant belongs to this vendor
        if (variant.product?.vendor_id !== vendorId) {
          throw new BadRequestException(
            `Variant ${variant.id} does not belong to vendor ${vendorId}`,
          );
        }

        // Get price from variant or fallback to product base price
        const price = variant.price || variant.product?.base_price || 0;
        if (price === 0) {
          throw new BadRequestException(
            `Price not found for variant ${variant.id}`,
          );
        }

        // Validate stock availability
        if (variant.status !== 'active') {
          throw new BadRequestException(
            `Variant ${variant.variant_name || variant.id} is not available`,
          );
        }

        return {
          order_id: vendorOrder.id,
          // parent_order_id: mainOrder.id,
          product_id: item.product_id || variant.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: price,
          store_id: item.store_id,
          // vendor_id: vendorId,
          // total: price * item.quantity,
          // vendor_name: vendor.business_name,
        };
      });

      // Calculate subtotal for this vendor
      const subtotal = orderItemsData.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      // Calculate shipping for this vendor
      const shippingCost = this.calculateShippingCost(
        vendorId,
        vendorItems,
        shipping_method,
      );

      // Calculate tax for this vendor (e.g., 7.5%)
      const taxRate = 0.075;
      const taxAmount = +(subtotal * taxRate).toFixed(2);

      // Update vendor order totals
      // vendorOrder.subtotal = subtotal;
      // vendorOrder.shipping_cost = shippingCost;
      // vendorOrder.tax_amount = taxAmount;
      vendorOrder.total_amount = +(subtotal + shippingCost + taxAmount).toFixed(
        2,
      );

      // Bulk create order items
      await this._orderItemRepository.bulkCreate(orderItemsData);

      // Save vendor order
      await vendorOrder.save();
      vendorOrders.push(vendorOrder);

      // Add to main order total
      totalAmount += vendorOrder.total_amount;
    }

    // Update main order total
    // mainOrder.total_amount = +totalAmount.toFixed(2);
    // await mainOrder.save();

    // Get customer details for payment
    const customer = await this._customerService.findOne(customer_id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customer_id} not found`);
    }

    // Initialize payment
    const paymentUrl = await this._paymentService.initializePayment(
      totalAmount,
      'NGN',
      {
        reference: orderReference,
        redirectUrl: `${process.env.APP_URL}/orders/callback`,
        customer: {
          id: customer_id,
          email: customer.user?.email || 'customer@example.com',
          phone_number: customer.user?.phone_number || '',
          name:
            `${customer.user?.first_name || ''} ${customer.user?.last_name || ''}`.trim() ||
            'Customer',
        },
        metadata: {
          // order_id: mainOrder.id,
          // order_reference: orderReference,
          customer_id,
          vendor_orders: vendorOrders.map((vo) => ({
            id: vo.id,
            vendor_id: vo.vendor_id,
            total: vo.total_amount,
          })),
        },
      },
    );

    return {
      // order: mainOrder,
      vendorOrders,
      paymentUrl,
    };
  }

  async createOrderFromCart(
    customerId: number,
    addressId: number,
  ): Promise<any> {
    const cart = await this._cartRepository.findOne({
      where: { customer_id: customerId },
    });

    if (!cart) {
      throw new NotFoundException(
        'User has no cart, please create one and retry!',
      );
    }
    console.log('cart', cart, cart.items);
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
        await this._inventoryService.reserve(
          item.variant_id,
          item.store_id,
          item.quantity,
        );

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
        item.variant_id,
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
      await this._inventoryService.confirm(item.variant_id, item.quantity);
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

  async findOneById(id: number, customerId: number): Promise<OrderModel> {
    try {
      // Validate input
      if (!id || id <= 0) {
        throw new BadRequestException('Invalid vendor ID');
      }

      // Direct query through associations
      const stores = await this._orderRepository.findOneByCustomerId(
        customerId,
        id,
      );

      return stores;
    } catch (error) {
      console.error(`Error finding stores for vendor ${id}:`, error.message);
      throw new InternalServerErrorException('Failed to retrieve stores');
    }
  }

  async findAllByCustomerId(
    id: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ orders: OrderModel[]; total: number }> {
    try {
      // Validate input
      if (!id || id <= 0) {
        throw new BadRequestException('Invalid vendor ID');
      }

      // Direct query through associations
      const orders = await this._orderRepository.findAllByCustomerId(
        id,
        page,
        limit,
      );

      return orders;
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
