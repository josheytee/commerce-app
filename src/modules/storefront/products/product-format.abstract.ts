// src/modules/vendor/products/formats/product.format.ts
import {
    MediaModel,
    ProductModel,
    ProductVariantModel,
    SectionModel,
    StoreModel,
    VendorModel,
} from 'src/infrastructure';
import {
    ProductResponseDto,
    ProductVariantResponseDto,
    ProductMediaResponseDto,
} from './dto';

export abstract class ProductFormat {
    // ============================================================
    // PUBLIC ENTRY POINT
    // ============================================================

    protected formatProductResponse(product: ProductModel): ProductResponseDto {
        const variants = this.getVariants(product);
        const media = this.getMedia(product);
        const reviews = product.reviews ?? [];

        // Pricing — sourced from variants, not the product
        const prices = variants
            .map((v) => this.toNumber(v.price))
            .filter((n): n is number => n !== undefined && n > 0);

        const minPrice =
            this.toNumber(product.min_variant_price) ??
            (prices.length ? Math.min(...prices) : 0);
        const maxPrice =
            this.toNumber(product.max_variant_price) ??
            (prices.length ? Math.max(...prices) : 0);

        // Best compare-at across variants (highest MSRP for display)
        const compareAtCandidates = variants
            .map((v) => this.toNumber(v.compare_at_price))
            .filter((n): n is number => n !== undefined && n > 0);
        const bestCompareAt = compareAtCandidates.length
            ? Math.max(...compareAtCandidates)
            : undefined;

        const hasDiscount = !!bestCompareAt && bestCompareAt > minPrice;
        const discountPercentage = hasDiscount
            ? Math.round(((bestCompareAt! - minPrice) / bestCompareAt!) * 100)
            : 0;

        // Media
        const featuredImage =
            media.find((m) => m.is_primary)?.url ?? media[0]?.url ?? null;
        const galleryImages = media
            .map((m) => m.url)
            .filter((url): url is string => !!url);

        // Ratings
        const averageRating =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + (this.toNumber(r.rating) ?? 0), 0) /
                reviews.length
                : 0;

        const currency = product.currency || 'USD';

        return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            short_description: product.short_description,
            specification: product.specification,

            // Pricing — variant-driven
            price: minPrice,
            // price_range: {
            //     min: minPrice,
            //     max: maxPrice,
            //     is_range: minPrice !== maxPrice,
            // },
            compare_at_price: bestCompareAt,
            formatted_price: this.formatPriceRange(minPrice, maxPrice, currency),
            discount_percentage: discountPercentage,

            // Status
            status: product.status,
            product_type: product.product_type,
            is_featured: product.is_featured,
            is_active: product.is_active,
            // is_taxable: product.is_taxable,
            // allow_backorders: product.allow_backorders,

            // Reviews
            rating: this.roundToOneDecimal(averageRating),
            review_count: reviews.length,
            // total_ratings: product.total_ratings,

            // Media
            featured_image: featuredImage,
            gallery_images: galleryImages,

            // Timestamps
            created_at: product.created_at,
            updated_at: product.updated_at,
            // published_at: product.published_at,

            // Relations
            section: this.formatSection(product.section),
            store: this.formatStore(product.store),
            vendor: this.formatVendor(product.vendor),
            variants: this.formatVariants(variants, currency),
        };
    }

    // ============================================================
    // VARIANT FORMATTER
    // ============================================================

    protected formatVariants(
        variants: ProductVariantModel[] | null | undefined,
        currency: string,
    ): ProductVariantResponseDto[] {
        if (!variants?.length) return [];

        return variants.map((variant) => {
            const price = this.toNumber(variant.price) ?? 0;
            const compareAt = this.toNumber(variant.compare_at_price);
            const cost = this.toNumber(variant.cost_price);

            const hasDiscount = !!compareAt && compareAt > price;
            const discountPercentage = hasDiscount
                ? Math.round(((compareAt! - price) / compareAt!) * 100)
                : 0;

            const inventories = (variant as any).inventories ?? [];
            const stockQuantity = inventories.reduce(
                (sum: number, inv: any) => sum + (this.toNumber(inv.quantity) ?? 0),
                0,
            );
            const reservedQuantity = inventories.reduce(
                (sum: number, inv: any) =>
                    sum + (this.toNumber(inv.reserved_quantity) ?? 0),
                0,
            );

            const variantMedia = this.getVariantMedia(variant);
            const variantImages = variantMedia
                .map((m) => m.url)
                .filter((url): url is string => !!url);

            return {
                id: variant.id,
                product_id: variant.product_id,
                variant_name: variant.variant_name,
                sku: variant.sku,
                barcode: variant.barcode,
                mpn: variant.mpn,

                price,
                compare_at_price: compareAt,
                cost_price: cost,
                formatted_price: this.formatCurrency(price, currency),
                discount_percentage: discountPercentage,

                // Stock (aggregated from inventories)
                stock_quantity: stockQuantity,
                reserved_quantity: reservedQuantity,
                available_quantity: stockQuantity - reservedQuantity,
                is_in_stock: stockQuantity - reservedQuantity > 0,

                // Shipping
                weight: this.toNumber(variant.weight),
                length: this.toNumber(variant.length),
                width: this.toNumber(variant.width),
                height: this.toNumber(variant.height),
                requires_shipping: variant.requires_shipping,
                shipping_class: variant.shipping_class,

                status: variant.status,
                is_default: variant.is_default,

                // Attributes
                attribute_values: this.formatVariantAttributes(variant),

                // Media
                images: variantImages,
                media: this.formatMedia(variantMedia),

                created_at: (variant as any).created_at,
                updated_at: (variant as any).updated_at,
            };
        });
    }

    // ============================================================
    // HELPERS
    // ============================================================

    private getVariants(product: ProductModel): ProductVariantModel[] {
        const variants =
            product.variants ?? product.getDataValue?.('variants') ?? [];
        return Array.isArray(variants) ? variants : [];
    }

    private getMedia(product: ProductModel): MediaModel[] {
        const media =
            product.gallery_images ?? product.getDataValue?.('gallery_images') ?? [];
        return Array.isArray(media) ? media : [];
    }

    private getVariantMedia(variant: ProductVariantModel): MediaModel[] {
        const media =
            (variant as any).gallery ?? variant.getDataValue?.('gallery') ?? [];
        return Array.isArray(media) ? media : [];
    }

    private formatVariantAttributes(variant: ProductVariantModel) {
        const values = (variant as any).attribute_values ?? [];
        return values.map((v: any) => ({
            attribute_id: v.attribute_id,
            attribute_code: v.attribute?.code,
            attribute_name: v.attribute?.name,
            attribute_value_id: v.attribute_value_id,
            value: v.attribute_value?.value,
            display_value:
                v.attribute_value?.display_value ?? v.attribute_value?.value,
            color_code: v.attribute_value?.color_code,
        }));
    }

    private formatMedia(
        media: MediaModel[] | null | undefined,
    ): ProductMediaResponseDto[] {
        if (!media?.length) return [];
        return media
            .filter((m) => !!m.url)
            .map((m) => ({
                id: m.id,
                url: m.url,
                type: m.type,
                is_primary: m.is_primary,
                sort_order: (m as any).sort_order ?? 0,
            }));
    }

    private toNumber(value: unknown): number | undefined {
        if (value === null || value === undefined || value === '') return undefined;
        const num = Number(value);
        return Number.isNaN(num) ? undefined : num;
    }

    private formatCurrency(amount: number, currency: string): string {
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency,
            }).format(amount);
        } catch {
            // Unknown currency code — fall back to plain number
            return `${amount.toFixed(2)} ${currency}`;
        }
    }

    private formatPriceRange(min: number, max: number, currency: string): string {
        if (min === max) return this.formatCurrency(min, currency);
        return `${this.formatCurrency(min, currency)} – ${this.formatCurrency(max, currency)}`;
    }

    private roundToOneDecimal(num: number): number {
        return Math.round(num * 10) / 10;
    }

    private formatStore(store?: StoreModel | null) {
        if (!store?.id) return null;
        return {
            id: store.id,
            name: store.name,
            slug: store.slug,
        };
    }

    private formatSection(section?: SectionModel | null) {
        if (!section?.id) return null;
        return {
            id: section.id,
            name: section.name,
            slug: section.slug,
        };
    }

    private formatVendor(vendor?: VendorModel | null) {
        if (!vendor?.id) return null;
        return {
            id: vendor.id,
            name: vendor.business_name ?? 'Unknown',
            rating: this.roundToOneDecimal(this.toNumber(vendor.rating_average) ?? 0),
            verified: vendor.is_verified ?? false,
        };
    }
}
