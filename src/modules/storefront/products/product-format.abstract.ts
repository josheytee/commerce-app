import {
    ProductModel,
    ProductVariantModel,
    SectionModel,
    StoreModel,
    VendorModel,
} from 'src/infrastructure';
import { ProductResponseDto } from './dto/index.dto';

export abstract class ProductFormat {
    protected formatProductResponse(product: ProductModel): ProductResponseDto {
        // Price calculations
        const basePrice = this.toNumber(product.base_price);
        const compareAtPrice = this.toNumber(product.compare_at_price) || basePrice;
        const hasDiscount = compareAtPrice > basePrice;

        const discountPercentage = hasDiscount
            ? Math.round(((compareAtPrice - basePrice) / compareAtPrice) * 100)
            : 0;

        // Media handling
        const images = product.gallery_images || [];
        const featuredImage =
            images.find((img) => img?.is_primary)?.url || images[0]?.url || null;

        const galleryImages = images
            .filter((img) => img?.url)
            .map((img) => img.url);

        const variants = product.variants || product.getDataValue('variants') || [];
        const reviews = product.reviews ?? [];

        // Rating calculations
        const averageRating =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + (this.toNumber(r.rating) || 0), 0) /
                reviews.length
                : 0;

        // Build response
        return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            short_description: product.short_description,
            specification: product.specification,

            // Pricing
            price: basePrice,
            compare_at_price: this.toNumber(product.compare_at_price) || undefined,
            cost_price: this.toNumber(product.cost_price) || undefined,
            final_price: hasDiscount ? basePrice : undefined,
            formatted_price: this.formatCurrency(basePrice),
            discount_percentage: discountPercentage,

            // Status
            status: product.status,
            product_type: product.product_type,
            is_featured: product.is_featured,
            is_active: product.is_active,

            // Reviews
            rating: this.roundToOneDecimal(averageRating),
            review_count: reviews.length,

            // Media
            featured_image: featuredImage,
            gallery_images: galleryImages,

            // Timestamps
            created_at: product.created_at,
            updated_at: product.updated_at,

            // Relations
            section: this.formatSection(product.section),
            store: this.formatStore(product.store),
            vendor: this.formatVendor(product.vendor),
            variants: this.formatVariants(variants),
        };
    }

    // Helper methods
    private toNumber(value: unknown): number | undefined {
        if (value === null || value === undefined) return undefined;
        const num = Number(value);
        return isNaN(num) ? undefined : num;
    }

    private formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
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
            name: vendor.business_name || vendor.business_name || 'Unknown',
            rating: this.roundToOneDecimal(this.toNumber(vendor.rating_average) || 0),
            verified: vendor.is_verified || false,
        };
    }
    private formatVariants(variants?: ProductVariantModel[] | null) {
        if (!variants || variants.length === 0) return [];
        return variants.map((variant) => ({
            id: variant.id,
            product_id: variant.product_id,
            variant_name: variant.variant_name,
            sku: variant.sku,
            discount_percentage: 0, // Placeholder, can calculate if needed

            price: this.toNumber(variant.price) || 0,
            compare_at_price: this.toNumber(variant.compare_at_price) || undefined,
            cost_price: this.toNumber(variant.cost_price) || undefined,
            weight: this.toNumber(variant.weight) || undefined,
            length: this.toNumber(variant.length) || undefined,
            width: this.toNumber(variant.width) || undefined,
            height: this.toNumber(variant.height) || undefined,
            requires_shipping: variant.requires_shipping,
            shipping_class: variant.shipping_class,
            status: variant.status,
            attribute_values: variant.attribute_values,

            // Variant media
            images:
                variant.gallery?.map((img) => img.url).filter((url) => !!url) || [],
        }));
    }
}
