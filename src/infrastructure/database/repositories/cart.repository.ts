import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from './base.repository';
import { CartModel } from '../models';

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
            include: ['items'],
        });
    }

}
