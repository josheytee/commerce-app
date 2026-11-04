import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
    ProductModel,
    ProductVariantModel,
    DiscountModel,
} from 'src/infrastructure';

export interface PriceResult {
    min_price: number;
    max_price: number;
    compare_at_price: number | null;
    discount_percentage: number;
    currency: string;
    variant_prices: Record<number, number>; // variant_id → final price
}

@Injectable()
export class PricingService {
    constructor(
        @InjectModel(ProductModel)
        private readonly productModel: typeof ProductModel,
        @InjectModel(ProductVariantModel)
        private readonly variantModel: typeof ProductVariantModel,
        @InjectModel(DiscountModel)
        private readonly discountModel: typeof DiscountModel,
    ) { }

    async getPrice(productId: number): Promise<PriceResult> {
        const product = await this.productModel.findByPk(productId, {
            include: [{ association: 'variants' }],
        });
        if (!product) throw new NotFoundException('Product not found');

        const variants = product.variants ?? [];
        if (!variants.length) {
            // Simple product should always have one variant; guard anyway
            return {
                min_price: 0,
                max_price: 0,
                compare_at_price: null,
                discount_percentage: 0,
                currency: product.currency,
                variant_prices: {},
            };
        }

        // Fetch active discounts for the product (polymorphic)
        const productDiscounts = await this.discountModel.findAll({
            where: {
                entity_id: productId,
                entity_type: 'product',
            } as any,
        });

        const variantPrices: Record<number, number> = {};
        let minPrice = Number.POSITIVE_INFINITY;
        let maxPrice = 0;
        let bestCompareAt: number | null = null;

        for (const variant of variants) {
            const basePrice = Number(variant.price);
            const compareAt = variant.compare_at_price
                ? Number(variant.compare_at_price)
                : null;

            // Apply variant-level discounts first, then product-level
            const variantDiscounts = await this.discountModel.findAll({
                where: {
                    entity_id: variant.id,
                    entity_type: 'product_variant',
                } as any,
            });

            const finalPrice = this.applyDiscounts(basePrice, [
                ...variantDiscounts,
                ...productDiscounts,
            ]);

            variantPrices[variant.id] = finalPrice;

            if (finalPrice < minPrice) minPrice = finalPrice;
            if (finalPrice > maxPrice) maxPrice = finalPrice;

            if (compareAt && (bestCompareAt === null || compareAt > bestCompareAt)) {
                bestCompareAt = compareAt;
            }
        }

        if (!Number.isFinite(minPrice)) minPrice = 0;

        const discountPercentage =
            bestCompareAt && bestCompareAt > minPrice
                ? ((bestCompareAt - minPrice) / bestCompareAt) * 100
                : 0;

        return {
            min_price: minPrice,
            max_price: maxPrice,
            compare_at_price: bestCompareAt,
            discount_percentage: Math.round(discountPercentage * 100) / 100,
            currency: product.currency,
            variant_prices: variantPrices,
        };
    }

    private applyDiscounts(
        basePrice: number,
        discounts: DiscountModel[],
    ): number {
        let price = basePrice;

        for (const discount of discounts) {
            const value = Number((discount as any).value ?? 0);
            const type = (discount as any).type; // 'percentage' | 'fixed'

            if (type === 'percentage' || type === 'PERCENTAGE') {
                price = price * (1 - value / 100);
            } else if (type === 'fixed' || type === 'FIXED') {
                price = Math.max(0, price - value);
            }
        }

        return Math.round(price * 100) / 100;
    }
}
