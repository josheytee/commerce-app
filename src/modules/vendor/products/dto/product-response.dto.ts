// dto/product-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

    @ApiProperty({
        type: ProductPricingDto,
        description: 'Product pricing information',
    })
    pricing: ProductPricingDto;

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

    @ApiProperty({ type: ProductMediaDto, description: 'Product media assets' })
    media: ProductMediaDto;

    @ApiProperty({
        type: ProductReviewSummaryDto,
        description: 'Review summary and recent reviews',
    })
    reviews: ProductReviewSummaryDto;

    @ApiPropertyOptional({
        type: CategoryDto,
        description: 'Product category/section',
    })
    category: CategoryDto | null;

    @ApiPropertyOptional({
        type: VendorDto,
        description: 'Product vendor information',
    })
    vendor: VendorDto | null;

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
