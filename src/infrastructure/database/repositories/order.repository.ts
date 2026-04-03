import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from './base.repository';
import {
    CustomerModel,
    OrderItemModel,
    OrderModel,
    ProductModel,
    VendorModel,
} from '../models';

@Injectable()
export class OrderRepository extends BaseRepository<OrderModel> {
    constructor(
        @InjectModel(OrderModel)
        private orderModel: typeof OrderModel,
    ) {
        super(orderModel);
    }

    // async remove(id: number): Promise<void> {
    //     const order = await this.findOne(id);
    //     await this.orderItemModel.destroy({ where: { order_id: id } });
    //     await order.destroy();
    // }

    // async findAllByVendorId(id: number): Promise<OrderModel[]> {
    //     // Direct query through associations
    //     const stores = await this.orderModel.findAll({
    //         include: [
    //             {
    //                 model: VendorModel,
    //                 as: 'vendor',
    //                 required: true,
    //                 where: { vendor_id: id },
    //                 include: [
    //                     {
    //                         model: CustomerModel,
    //                         as: 'customer',
    //                         required: true,
    //                         attributes: [], // Don't need to return user data
    //                     },
    //                 ],
    //             },
    //         ],
    //     });

    //     return stores;
    // }

    async findOneByVendorId(
        vendorId: number,
        orderId: number,
    ): Promise<OrderModel> {
        const order = await this.orderModel.findOne({
            where: { id: orderId },
            include: [
                {
                    model: VendorModel,
                    as: 'vendor',
                    required: true,
                    where: { id: vendorId },
                    attributes: [
                        'id',
                        'business_name',
                        'business_email',
                        'business_phone',
                    ],
                },
                {
                    model: OrderItemModel,
                    as: 'items',
                    required: false,
                    include: [
                        {
                            model: ProductModel,
                            as: 'product',
                            required: false,
                            attributes: ['id', 'name', 'slug', 'price', 'featured_image'],
                        },
                    ],
                },
                {
                    model: CustomerModel,
                    as: 'customer',
                    required: false,
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
                },
            ],
        });

        if (!order) {
            throw new NotFoundException(
                `Order with ID ${orderId} not found for vendor ${vendorId}`,
            );
        }

        return order;
    }

    // Additional useful methods
    async findAllByVendorId(
        vendorId: number,
        page: number = 1,
        limit: number = 10,
    ): Promise<{ orders: OrderModel[]; total: number }> {
        const offset = (page - 1) * limit;

        const { rows, count } = await this.orderModel.findAndCountAll({
            include: [
                {
                    model: VendorModel,
                    as: 'vendor',
                    required: true,
                    where: { id: vendorId },
                },
                {
                    model: OrderItemModel,
                    as: 'items',
                    required: false,
                },
            ],
            limit,
            offset,
            order: [['created_at', 'DESC']],
        });

        return {
            orders: rows,
            total: count,
        };
    }

    async findOrdersByVendorAndStatus(
        vendorId: number,
        status: string,
    ): Promise<OrderModel[]> {
        return this.orderModel.findAll({
            where: { status },
            include: [
                {
                    model: VendorModel,
                    as: 'vendor',
                    required: true,
                    where: { id: vendorId },
                },
                {
                    model: OrderItemModel,
                    as: 'items',
                    required: false,
                },
            ],
            order: [['created_at', 'DESC']],
        });
    }
}
