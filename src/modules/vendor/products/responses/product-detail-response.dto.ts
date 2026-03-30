// responses/product-detail-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductVariantResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'PROD-BLK-S' })
    sku: string;

    @ApiProperty({ type: 'object', example: { color: 'black', size: 'S' } })
    attributes: Record<string, string>;

    @ApiProperty({ example: 0 })
    priceAdjustment: number;

    @ApiProperty({ example: 50 })
    stockQuantity: number;
}

export class ProductDetailResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Premium Wireless Headphones' })
    name: string;

    @ApiProperty({ example: 'premium-wireless-headphones' })
    slug: string;

    @ApiProperty({ example: 99.99 })
    price: number;

    @ApiPropertyOptional({ example: 'High-quality wireless headphones...' })
    details?: string;

    @ApiProperty({ example: 'active', enum: ['active', 'inactive', 'draft'] })
    status: string;

    @ApiProperty({ example: 1 })
    storeId: number;

    @ApiProperty({ example: 5 })
    sectionId: number;

    @ApiProperty({ type: [ProductVariantResponseDto] })
    variants: ProductVariantResponseDto[];

    @ApiProperty({ example: '2024-01-15T10:30:00Z' })
    createdAt: string;

    @ApiProperty({ example: '2024-01-20T14:22:00Z' })
    updatedAt: string;
}