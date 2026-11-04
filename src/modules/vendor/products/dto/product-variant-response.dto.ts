// dto/product-variant-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductMediaResponseDto } from './product-media-response.dto';

export class VariantDimensionsDto {
    @ApiPropertyOptional({ example: 0.5, description: 'Weight in kg' })
    weight?: number;

    @ApiPropertyOptional({ example: 10.5, description: 'Length in cm' })
    length?: number;

    @ApiPropertyOptional({ example: 8.0, description: 'Width in cm' })
    width?: number;

    @ApiPropertyOptional({ example: 5.5, description: 'Height in cm' })
    height?: number;
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

export class VariantAttributeDto {
    @ApiProperty({ example: 1 })
    attribute_id: number;

    @ApiPropertyOptional({ example: 'color', description: 'URL-safe attribute code' })
    attribute_code?: string;

    @ApiPropertyOptional({ example: 'Color' })
    attribute_name?: string;

    @ApiProperty({ example: 5 })
    attribute_value_id: number;

    @ApiPropertyOptional({ example: 'red', description: 'Canonical value' })
    value?: string;

    @ApiPropertyOptional({ example: 'Crimson Red', description: 'Pretty display label' })
    display_value?: string;

    @ApiPropertyOptional({ example: '#FF0000', description: 'Hex color for swatches' })
    color_code?: string;
}

export class ProductVariantResponseDto {
    @ApiProperty({ example: 42 })
    id: number;

    @ApiProperty({ example: 7 })
    product_id: number;

    @ApiPropertyOptional({ example: 'Red / Size 42' })
    variant_name?: string;

    @ApiProperty({ example: 'NIKE-AIR-MAX-RED-42' })
    sku: string;

    @ApiPropertyOptional({ example: '0888999000112' })
    barcode?: string;

    @ApiPropertyOptional({ example: 'NIKE-AIRMAX-R-42' })
    mpn?: string;

    @ApiProperty({ example: 129.99 })
    price: number;

    @ApiPropertyOptional({ example: 149.99 })
    compare_at_price?: number;

    @ApiPropertyOptional({ example: 89.5 })
    cost_price?: number;

    @ApiProperty({ example: '$129.99' })
    formatted_price: string;

    @ApiProperty({
        example: 13.33,
        description: 'Discount % vs. compare_at_price',
    })
    discount_percentage: number;

    @ApiProperty({ example: 50, description: 'Sum of quantity across all stores' })
    stock_quantity: number;

    @ApiProperty({ example: 3, description: 'Sum of reserved_quantity across all stores' })
    reserved_quantity: number;

    @ApiProperty({ example: 47, description: 'stock_quantity - reserved_quantity' })
    available_quantity: number;

    @ApiProperty({ example: true })
    is_in_stock: boolean;

    @ApiPropertyOptional({ example: 0.5, description: 'kg' })
    weight?: number;

    @ApiPropertyOptional({ example: 30, description: 'cm' })
    length?: number;

    @ApiPropertyOptional({ example: 20, description: 'cm' })
    width?: number;

    @ApiPropertyOptional({ example: 15, description: 'cm' })
    height?: number;

    @ApiProperty({ example: true })
    requires_shipping: boolean;

    @ApiPropertyOptional({ example: 'standard' })
    shipping_class?: string;

    @ApiProperty({ example: 'active' })
    status: string;

    @ApiProperty({
        example: false,
        description: 'True for the single default variant of a SIMPLE product',
    })
    is_default: boolean;

    @ApiProperty({ type: [VariantAttributeDto] })
    attribute_values: VariantAttributeDto[];

    @ApiProperty({ type: [String], example: ['https://cdn.example.com/v1.jpg'] })
    images: string[];

    @ApiProperty({ type: [ProductMediaResponseDto] })
    media: ProductMediaResponseDto[];

    @ApiPropertyOptional({ example: '2025-01-15T10:00:00.000Z' })
    created_at?: Date;

    @ApiPropertyOptional({ example: '2025-01-15T10:00:00.000Z' })
    updated_at?: Date;
}


