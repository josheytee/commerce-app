// dto/product-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductVariantResponseDto } from './product-variant-response.dto';

export class CategoryDto {
    @ApiProperty({ example: 1, description: 'Category ID' })
    id: number;

    @ApiProperty({ example: 'Electronics', description: 'Category name' })
    name: string;

    @ApiProperty({ example: 'electronics', description: 'Category slug' })
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

export class ProductPricingDto {
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
}

export class ProductMediaDto {
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
}

export class ProductReviewSummaryDto {
    @ApiProperty({ example: 4.5, description: 'Average rating (0-5)' })
    rating: number;

    @ApiProperty({ example: 128, description: 'Total review count' })
    review_count: number;

    @ApiProperty({
        type: [RecentReviewDto],
        description: 'Recent reviews preview',
    })
    recent_reviews: RecentReviewDto[];
}
export class ProductPriceRangeDto {
    @ApiProperty({ example: 99.99 })
    min: number;

    @ApiProperty({ example: 149.99 })
    max: number;

    @ApiProperty({ example: true, description: 'True when min !== max' })
    is_range: boolean;
}

export class ProductOwnerDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Acme Store' })
    name: string;

    @ApiProperty({ example: 'acme-store' })
    slug: string;
}

export class ProductVendorDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Acme Inc.' })
    name: string;

    @ApiProperty({ example: 4.7 })
    rating: number;

    @ApiProperty({ example: true })
    verified: boolean;
}

export class ProductResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Running Shoes' })
    name: string;

    @ApiProperty({ example: 'running-shoes' })
    slug: string;

    @ApiPropertyOptional({ example: 'Long description...' })
    description?: string;

    @ApiPropertyOptional({ example: 'Short summary...' })
    short_description?: string;

    @ApiPropertyOptional({ example: 'Weight: 300g, Material: mesh' })
    specification?: string;

    // ============ PRICING ============
    @ApiProperty({
        example: 99.99,
        description: 'Minimum variant price (single value for simple products)',
    })
    price: number;

    @ApiProperty({ type: ProductPriceRangeDto })
    price_range: ProductPriceRangeDto;

    @ApiPropertyOptional({
        example: 149.99,
        description: 'Highest compare_at_price across variants',
    })
    compare_at_price?: number;

    @ApiProperty({ example: '$99.99', description: 'Formatted min (or range) price' })
    formatted_price: string;

    @ApiProperty({ example: 33, description: 'Discount % vs. best compare_at_price' })
    discount_percentage: number;

    // ============ STATUS ============
    @ApiProperty({ example: 'published' })
    status: string;

    @ApiProperty({ example: 'variable', enum: ['simple', 'variable'] })
    product_type: string;

    @ApiProperty({ example: false })
    is_featured: boolean;

    @ApiProperty({ example: true })
    is_active: boolean;

    @ApiProperty({ example: false })
    is_taxable: boolean;

    @ApiProperty({ example: false })
    allow_backorders: boolean;

    // ============ REVIEWS ============
    @ApiProperty({ example: 4.5 })
    rating: number;

    @ApiProperty({ example: 27 })
    review_count: number;

    @ApiProperty({ example: 27 })
    total_ratings: number;

    // ============ MEDIA ============
    @ApiPropertyOptional({
        example: 'https://cdn.example.com/products/hero.jpg',
        nullable: true,
    })
    featured_image: string | null;

    @ApiProperty({
        type: [String],
        example: [
            'https://cdn.example.com/products/1.jpg',
            'https://cdn.example.com/products/2.jpg',
        ],
    })
    gallery_images: string[];

    // ============ TIMESTAMPS ============
    @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
    created_at: Date;

    @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
    updated_at: Date;

    @ApiPropertyOptional({ example: '2025-01-16T09:00:00.000Z', nullable: true })
    published_at?: Date | null;

    // ============ RELATIONS ============
    @ApiPropertyOptional({ type: ProductOwnerDto, nullable: true })
    section: ProductOwnerDto | null;

    @ApiPropertyOptional({ type: ProductOwnerDto, nullable: true })
    store: ProductOwnerDto | null;

    @ApiPropertyOptional({ type: ProductVendorDto, nullable: true })
    vendor: ProductVendorDto | null;

    @ApiProperty({ type: [ProductVariantResponseDto] })
    variants: ProductVariantResponseDto[];
}