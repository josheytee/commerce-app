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
import { CartStatusEnum } from 'src/shared';
import { Transaction } from 'sequelize';

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

    /**
     * Lock the cart row for update. Use inside a transaction to serialize
     * concurrent checkout attempts on the same cart.
     *
     * Deliberately has no includes — Postgres forbids FOR UPDATE across
     * outer joins.
     */
    async lockActiveCart(
        customerId: number,
        transaction?: Transaction,
    ): Promise<CartModel | null> {
        return this.findOne({
            where: { customer_id: customerId, status: CartStatusEnum.ACTIVE },
            lock: transaction.LOCK.UPDATE,
            transaction,
        });
    }
    //   async findActiveCart(
    //     customerId: number,
    //     transaction?: Transaction,
    //   ): Promise<CartModel | null> {
    //     return this.findOne({
    //       where: { customer_id: customerId, status: CartStatusEnum.ACTIVE },
    //       transaction,
    //     });
    //   }
    async findActiveCart(customerId: number, transaction?: Transaction) {
        return this.model.findOne({
            where: {
                customer_id: customerId,
                status: CartStatusEnum.ACTIVE,
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
                                    attributes: ['id', 'name', 'slug', 'base_price'],
                                },
                            ],
                        },
                    ],
                },
            ],
            transaction,
        });
    }
}
