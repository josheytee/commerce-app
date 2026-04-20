// dto/product-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VariantAttributeInfoDto } from 'src/modules/vendor/products/dto/variant-response.dto';

export class SectionDto {
    @ApiProperty({ example: 1, description: 'Section ID' })
    id: number;

    @ApiProperty({ example: 'Electronics', description: 'Section name' })
    name: string;

    @ApiProperty({ example: 'electronics', description: 'Section slug' })
    slug: string;
}

export class VendorDto {
    @ApiProperty({ example: 1, description: 'Vendor ID' })
    id: number;

    @ApiProperty({
        example: 'Tech Store Inc.',
        description: 'Vendor business name',
    })
    name: string;

    @ApiProperty({ example: 4.5, description: 'Vendor average rating' })
    rating: number;

    @ApiProperty({ example: true, description: 'Whether vendor is verified' })
    verified: boolean;
}

export class RecentReviewDto {
    @ApiProperty({ example: 5, description: 'Review rating (1-5)' })
    rating: number;

    @ApiProperty({
        example: 'Great product, highly recommended!',
        description: 'Review comment',
    })
    comment: string;

    @ApiProperty({ example: 'John Doe', description: 'Review author name' })
    author: string;

    @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Review date' })
    date: Date;
}

export class ProductStoreDto {
    @ApiProperty({ example: 1, description: 'Store ID' })
    id: number;

    @ApiProperty({
        example: 'Tech Store',
        description: 'Store name/alias',
    })
    name: string;

    @ApiProperty({ example: 'tech-store', description: 'Store slug' })
    slug: string;
}



export class VariantInventorySummaryDto {
    @ApiProperty({ example: 150, description: 'Total physical stock quantity' })
    stock_quantity: number;

    @ApiProperty({
        example: 145,
        description: 'Available quantity (stock - reserved)',
    })
    available_quantity: number;

    @ApiProperty({ example: 5, description: 'Reserved quantity' })
    reserved_quantity: number;

    @ApiProperty({
        enum: ['in_stock', 'out_of_stock', 'low_stock', 'backorder', 'pre_order'],
        example: 'in_stock',
        description: 'Stock status',
    })
    stock_status: string;

    @ApiProperty({ example: 10, description: 'Low stock threshold' })
    low_stock_threshold: number;

    @ApiProperty({
        example: false,
        description: 'Whether backorders are allowed',
    })
    allow_backorders: boolean;
}

export class AttributeValueDto {
    @ApiProperty({ example: 1024, description: 'Unique variant identifier' })
    id: number;

    @ApiProperty({ example: 266, description: ' Attribute ID' })
    attribute_id: number;

    @ApiProperty({
        example: 'red',
        description: 'Value code (e.g., "red", "xl", "cotton")',
    })
    value: string;

    @ApiProperty({
        example: 'Crimson Red',
        description: '(pretty name)',
    })
    display_value: string;

    @ApiPropertyOptional({
        example: '#FF0000',
        description: 'color code ',
    })
    color_code?: string;

    @ApiPropertyOptional({
        example: 'NIKE-12345',
        description: 'Manufacturer Part Number',
    })
    sort_order?: string;

    @ApiPropertyOptional({
        example: 'https://cdn.example.com/variants/1024.jpg',
        description: 'Primary variant image URL',
    })
    image_url?: string;
}
export class ProductVariantResponseDto {
    @ApiProperty({ example: 1024, description: 'Unique variant identifier' })
    id: number;

    @ApiProperty({ example: 266, description: 'Parent product ID' })
    product_id: number;


    @ApiProperty({
        example: 'PWH-RED-XL-COT',
        description: 'SKU - Stock Keeping Unit',
    })
    sku: string;

    @ApiPropertyOptional({
        example: '1234567890123',
        description: 'Barcode (EAN/UPC)',
    })
    barcode?: string;

    @ApiPropertyOptional({
        example: 'NIKE-12345',
        description: 'Manufacturer Part Number',
    })
    mpn?: string;

    @ApiProperty({
        example: 'Red / XL / Cotton',
        description: 'Display name for this variant',
    })
    variant_name: string;

    @ApiPropertyOptional({
        example: 89.99,
        description: 'Variant-specific price (overrides product price if set)',
    })
    price?: number;

    @ApiPropertyOptional({
        example: 109.99,
        description: 'Compare-at/original price',
    })
    compare_at_price?: number;

    @ApiPropertyOptional({
        example: 45.5,
        description: 'Cost price for margin calculations',
    })
    cost_price?: number;

    @ApiProperty({
        example: 18,
        description: 'Discount percentage (calculated from compare_at_price)',
    })
    discount_percentage: number;

    @ApiPropertyOptional({
        example: 'https://cdn.example.com/variants/1024.jpg',
        description: 'Primary variant image URL',
    })
    image_url?: string;

    @ApiPropertyOptional({ example: 0.5, description: 'Weight in kg' })
    weight?: number;

    @ApiPropertyOptional({ example: 10.5, description: 'Length in cm' })
    length?: number;

    @ApiPropertyOptional({ example: 8.0, description: 'Width in cm' })
    width?: number;

    @ApiPropertyOptional({ example: 5.5, description: 'Height in cm' })
    height?: number;

    @ApiProperty({
        example: true,
        description: 'Whether this variant requires shipping',
    })
    requires_shipping: boolean;

    @ApiPropertyOptional({
        example: 'standard',
        description: 'Shipping class/category',
    })
    shipping_class?: string;

    @ApiPropertyOptional({
        example: { warehouse: 'NYC', priority: 'high' },
        description: 'Additional metadata',
        type: 'object',
    })
    metadata?: Record<string, any>;

    @ApiProperty({
        enum: ['active', 'inactive', 'out_of_stock', 'discontinued'],
        example: 'active',
        description: 'Variant status',
    })
    status: string;


    @ApiPropertyOptional({
        type: VariantInventorySummaryDto,
        description: 'Inventory information',
    })
    inventory?: VariantInventorySummaryDto;

    // @ApiProperty({
    //     example: [
    //         'https://cdn.example.com/variants/1024-1.jpg',
    //         'https://cdn.example.com/variants/1024-2.jpg',
    //     ],
    //     description: 'Gallery image URLs',
    //     type: [String],
    // })
    // gallery_images: string[];

    // @ApiProperty({
    //     example: '2024-01-10T08:00:00Z',
    //     description: 'Creation timestamp',
    // })
    // created_at: Date;

    // @ApiProperty({
    //     example: '2024-01-15T14:30:00Z',
    //     description: 'Last update timestamp',
    // })
    // updated_at: Date;
}

export class ProductResponseDto {
    @ApiProperty({ example: 266, description: 'Unique product identifier' })
    id: number;

    @ApiProperty({
        example: 'Premium Wireless Headphones',
        description: 'Product name',
    })
    name: string;

    @ApiProperty({
        example: 'premium-wireless-headphones',
        description: 'URL-friendly slug',
    })
    slug: string;

    @ApiPropertyOptional({
        example:
            'Experience crystal-clear audio with our premium wireless headphones...',
        description: 'Full product description (HTML supported)',
    })
    description?: string;

    @ApiPropertyOptional({
        example: 'High-quality wireless headphones with noise cancellation',
        description: 'Short description for listings',
    })
    short_description?: string;

    @ApiPropertyOptional({
        example: 'High-quality wireless headphones with noise cancellation',
        description: 'Product specification details',
    })
    specification?: string;

    @ApiProperty({ example: 99.99, description: 'Base product price' })
    price: number;

    @ApiPropertyOptional({
        example: 129.99,
        description: 'Original/compare-at price',
    })
    compare_at_price?: number;

    @ApiPropertyOptional({ example: 45.5, description: 'Product cost price' })
    cost_price?: number;

    @ApiPropertyOptional({
        example: 99.99,
        description: 'Final price after discounts',
    })
    final_price?: number;

    @ApiProperty({ example: '$99.99', description: 'Formatted price string' })
    formatted_price: string;

    @ApiProperty({ example: 23, description: 'Discount percentage (0-100)' })
    discount_percentage: number;

    @ApiProperty({
        enum: [
            'draft',
            'pending',
            'published',
            'archived',
            'out_of_stock',
            'discontinued',
        ],
        example: 'published',
        description: 'Product status',
    })
    status: string;

    @ApiProperty({
        enum: ['simple', 'variable', 'digital', 'service', 'bundle'],
        example: 'variable',
        description: 'Product type',
    })
    product_type: string;

    @ApiProperty({ example: true, description: 'Whether product is featured' })
    is_featured: boolean;

    @ApiProperty({ example: true, description: 'Whether product is active' })
    is_active: boolean;

    @ApiProperty({
        example: 'https://cdn.example.com/products/123-main.jpg',
        description: 'Featured image URL',
    })
    featured_image: string | null;

    @ApiProperty({
        example: [
            'https://cdn.example.com/products/123-1.jpg',
            'https://cdn.example.com/products/123-2.jpg',
        ],
        description: 'Gallery image URLs',
        type: [String],
    })
    gallery_images: string[];

    @ApiProperty({ example: 4.5, description: 'Average rating (0-5)' })
    rating: number;

    @ApiProperty({ example: 128, description: 'Total review count' })
    review_count: number;

    // @ApiProperty({
    //     type: [RecentReviewDto],
    //     description: 'Recent reviews preview',
    // })
    // recent_reviews: RecentReviewDto[];

    @ApiProperty({
        type: [ProductVariantResponseDto],
        description: 'Product variants information',
    })
    variants: ProductVariantResponseDto[];

    @ApiPropertyOptional({
        type: SectionDto,
        description: 'Product Section/section',
    })
    section: SectionDto | null;

    @ApiPropertyOptional({
        type: VendorDto,
        description: 'Product vendor information',
    })
    vendor: VendorDto | null;

    @ApiPropertyOptional({
        type: ProductStoreDto,
        description: 'Product store information',
    })
    store: ProductStoreDto | null;

    @ApiProperty({
        example: '2024-01-10T08:00:00Z',
        description: 'Creation timestamp',
    })
    created_at: Date;

    @ApiProperty({
        example: '2024-01-15T14:30:00Z',
        description: 'Last update timestamp',
    })
    updated_at: Date;
}
