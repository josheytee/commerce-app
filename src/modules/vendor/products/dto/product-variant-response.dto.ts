// dto/product-variant-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

export class ProductVariantResponseDto {
    @ApiProperty({ example: 1024, description: 'Unique variant identifier' })
    id: number;

    @ApiProperty({ example: 266, description: 'Parent product ID' })
    product_id: number;

    @ApiProperty({
        example: { color: 'Red', size: 'XL', material: 'Cotton' },
        description: 'Variant attributes as key-value pairs',
        type: 'object',
    })
    attributes: Record<string, any>;

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

    @ApiProperty({
        type: VariantDimensionsDto,
        description: 'Shipping dimensions',
    })
    dimensions: VariantDimensionsDto;

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

