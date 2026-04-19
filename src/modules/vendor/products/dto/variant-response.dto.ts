// dto/variant-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VariantAttributeInfoDto {
    @ApiProperty({ example: 1, description: 'Attribute ID' })
    attribute_id: number;

    @ApiProperty({ example: 'color', description: 'Attribute code' })
    attribute_code: string;

    @ApiProperty({ example: 'Color', description: 'Attribute name' })
    attribute_name: string;

    @ApiProperty({ example: 5, description: 'Attribute value ID' })
    value_id: number;

    @ApiProperty({ example: 'red', description: 'Value code' })
    value: string;

    @ApiProperty({ example: 'Crimson Red', description: 'Display value' })
    display_value: string;

    @ApiPropertyOptional({ example: '#DC143C', description: 'Hex color code' })
    color_code?: string;
}

export class VariantInventoryDto {
    @ApiProperty({ example: 150 })
    stock_quantity: number;

    @ApiProperty({ example: 145 })
    available_quantity: number;

    @ApiProperty({ example: 5 })
    reserved_quantity: number;

    @ApiProperty({
        example: 'in_stock',
        enum: ['in_stock', 'out_of_stock', 'low_stock', 'backorder'],
    })
    stock_status: string;
}

export class VariantResponseDto {
    @ApiProperty({ example: 1024 })
    id: number;

    @ApiProperty({ example: 266 })
    product_id: number;

    @ApiProperty({ example: 'NIKE-AM-42-BLK' })
    sku: string;

    @ApiProperty({ example: 'Red / 42 / Leather' })
    variant_name: string;

    @ApiProperty({ type: [VariantAttributeInfoDto] })
    attribute_values: VariantAttributeInfoDto[];

    @ApiPropertyOptional({ example: 99.99 })
    price?: number;

    @ApiProperty({ example: 18, description: 'Discount percentage' })
    discount_percentage: number;

    @ApiPropertyOptional({ type: VariantInventoryDto })
    inventory?: VariantInventoryDto;

    @ApiProperty({ example: true })
    is_available: boolean;
}
