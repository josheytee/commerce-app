import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderItem } from './models/order-item.model';
import { Order } from './models/order.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(OrderItem)
    private orderItemModel: typeof OrderItem,
  ) {}

  async create(
    data: Partial<Order>,
    items: Partial<OrderItem>[],
  ): Promise<Order> {
    const order = await this.orderModel.create(data);
    for (const item of items) {
      await this.orderItemModel.create({ ...item, order_id: order.id });
    }
    return order;
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.findAll({ include: [OrderItem] });
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
}
