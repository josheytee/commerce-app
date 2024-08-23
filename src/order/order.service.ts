import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderItem } from './models/order-item.model';
import { Order } from './models/order.model';
import { PaymentService } from 'src/payment/payment.service';
import { CustomerService } from 'src/account/customer/customer.service';
import { OrderSearchCriteria } from './order-search-criteria.interface';
// import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(OrderItem)
    private orderItemModel: typeof OrderItem,
    private readonly paymentService: PaymentService,
    private readonly customerService: CustomerService,
  ) {}

  async create(
    customerId: number,
    items: any[],
    // paymentDetails: any,
  ): Promise<any> {
    const orderReference = this.generateOrderReference(customerId);
    let totalAmount = 0;
    // console.log('order_reference', orderReference);
    const order = await this.orderModel.create({
      order_reference: orderReference,
      customer_id: customerId,
      status: 'pending',
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

    await this.orderItemModel.bulkCreate(orderItems);

    order.total_amount = totalAmount;

    // Process payment
    // const paymentResponse = await this.paymentService.initializePayment(
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
    const customer = await this.customerService.findOne(customerId);
    const paymentUrl = await this.paymentService.initializePayment(
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

  async handlePaymentCallback(data: any): Promise<void> {
    await this.paymentService.handleCallback('order', data);
  }

  // async processPayment(orderId: number, paymentMethod: string): Promise<any> {
  //   // Process payment
  //   const order = await this.orderModel.findByPk(orderId);
  //   if (!order) {
  //     throw new Error('Order not found');
  //   }
  //   const paymentResponse = await this.paymentService.processPayment(
  //     orderId,
  //     paymentMethod,
  //   );
  //   return paymentResponse;
  // }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const order = await this.orderModel.findByPk(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = status;
    await order.save();
    return order;
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.findAll({ include: [OrderItem] });
  }

  async find(criteria: OrderSearchCriteria): Promise<Order | null> {
    return this.orderModel.findOne({ where: criteria as any });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderModel.findByPk(id, { include: [OrderItem] });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async update(
    id: number,
    data: Partial<Order>,
    items: Partial<OrderItem>[],
  ): Promise<Order> {
    const order = await this.findOne(id);
    await order.update(data);

    // Delete old items
    await this.orderItemModel.destroy({ where: { order_id: id } });

    // Add new items
    for (const item of items) {
      await this.orderItemModel.create({ ...item, order_id: order.id });
    }

    return order;
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderItemModel.destroy({ where: { order_id: id } });
    await order.destroy();
  }

  async confirmOrder(paymentReference: string) {
    // const paymentVerified =
    //   await this.paymentService.verifyPayment(paymentReference);
    // if (paymentVerified) {
    //   // Complete the order
    // } else {
    //   // Handle payment failure
    // }
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
}
