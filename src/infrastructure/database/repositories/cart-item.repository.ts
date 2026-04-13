import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from './base.repository';
import { CartItemModel } from '../models';

@Injectable()
export class CartItemRepository extends BaseRepository<CartItemModel> {
    constructor(
        @InjectModel(CartItemModel)
        private cartItemModel: typeof CartItemModel,
    ) {
        super(cartItemModel);
    }

    async findByVariant(cartId: number, variantId: number) {
        return this.model.findOne({
            where: {
                cart_id: cartId,
                product_variant_id: variantId,
            },
        });
    }
}
