import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from './base.repository';
import {
    CartItemModel,
    CartModel,
    ProductModel,
    ProductVariantModel,
    StoreModel,
    VendorModel,
} from '../models';

@Injectable()
export class CartRepository extends BaseRepository<CartModel> {
    constructor(
        @InjectModel(CartModel)
        private cartModel: typeof CartModel,
    ) {
        super(cartModel);
    }

    async findByCustomerId(customerId: number) {
        return await this.findOne({ where: { customer_id: customerId } });
    }

    async findActiveCart(customerId: number) {
        return this.model.findOne({
            where: {
                customer_id: customerId,
                // expires_at: { [Op.gt]: new Date() },
            },
            include: [
                {
                    model: CartItemModel,
                    as: 'items',
                    required: false,
                    include: [
                        // 'variant',
                        {
                            model: StoreModel,
                            as: 'store',
                            required: false,
                            attributes: ['id', 'name', 'slug'],
                            include: [
                                {
                                    model: VendorModel,
                                    as: 'vendor',
                                    required: false,
                                    attributes: ['id', 'business_name', 'slug'],
                                },
                            ],
                        },
                        {
                            model: ProductVariantModel,
                            as: 'variant',
                            required: true,
                            include: [
                                {
                                    model: ProductModel,
                                    as: 'product',
                                    required: false,
                                    attributes: ['id', 'name', 'slug', 'price'],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    }
}
