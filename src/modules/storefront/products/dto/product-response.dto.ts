
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatusEnum, ProductTypeEnum } from 'src/shared';

class CategoryResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    slug: string;
}

class VendorResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    rating: number;

    @ApiProperty()
    verified: boolean;
}

class ReviewResponseDto {
    @ApiProperty()
    rating: number;

    @ApiProperty()
    comment: string;
}

export class ProductResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    slug: string;

    @ApiPropertyOptional()
    description?: string;

    @ApiPropertyOptional()
    short_description?: string;

    @ApiProperty()
    price: number;

    @ApiPropertyOptional()
    compare_at_price?: number;

    @ApiPropertyOptional()
    cost_price?: number;

    @ApiProperty()
    formatted_price: string;

    @ApiPropertyOptional()
    discount_percentage?: number;

    @ApiPropertyOptional()
    final_price?: number;

    // @ApiPropertyOptional()
    // sku?: string;

    @ApiProperty({ enum: ProductStatusEnum })
    status: ProductStatusEnum;

    @ApiProperty({ enum: ProductTypeEnum })
    product_type: ProductTypeEnum;

    @ApiProperty()
    is_featured: boolean;

    @ApiProperty()
    is_active: boolean;

    @ApiProperty()
    rating: number;

    @ApiProperty()
    review_count: number;

    // @ApiProperty()
    // sales_count: number;

    // @ApiProperty()
    // stock_quantity: number;

    @ApiPropertyOptional()
    featured_image?: string;

    @ApiPropertyOptional({ type: [String] })
    gallery_images?: string[];

    @ApiProperty()
    category: CategoryResponseDto;

    @ApiProperty()
    vendor: VendorResponseDto;

    @ApiPropertyOptional({ type: [ReviewResponseDto] })
    recent_reviews?: ReviewResponseDto[];

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;
}
