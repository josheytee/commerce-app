import { Injectable } from '@nestjs/common';

import { DiscountModel, ProductModel } from 'src/infrastructure';

@Injectable()
export class PricingService {
    async getPrice(productId: number) {
        const product = await ProductModel.findByPk(productId);

        const discount = await DiscountModel.findOne({
            where: {
                entity_type: 'product',
                entity_id: productId,
                // start_date: { [Op.lte]: now },
                // end_date: { [Op.gte]: now },
                is_active: true,
            },
        });

        let finalPrice = product.price;

        if (discount) {
            if (discount.type === 'percentage') {
                finalPrice = product.price * (1 - discount.value / 100);
            } else {
                finalPrice = Math.max(0, product.price - discount.value);
            }
        }

        let discountPercentage = 0;

        //   discount_percentage(): number {
        if (product.compare_at_price && product.compare_at_price > product.price) {
            discountPercentage =
                ((product.compare_at_price - product.price) /
                    product.compare_at_price) *
                100;
        }

        return {
            base_price: product.price,
            final_price: finalPrice,
            discount,
            discount_percentage: discountPercentage,
        };
    }
}
