// src/modules/vendor/products/attribute/dto/attribute-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AttributeValueResponseDto {
    @ApiProperty({ example: 5 })
    id: number;

    @ApiProperty({ example: 1 })
    attribute_id: number;

    @ApiProperty({ example: 'Red' })
    value: string;

    @ApiPropertyOptional({ example: 'Crimson Red' })
    display_value?: string;

    @ApiPropertyOptional({ example: '#FF0000' })
    color_code?: string;

    @ApiPropertyOptional({ example: 'https://cdn.example.com/swatches/red.png' })
    image_url?: string;

    @ApiProperty({ example: 0 })
    sort_order: number;
}

export class AttributeResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiPropertyOptional({
        example: null,
        nullable: true,
        description: 'null for platform attributes, vendor id for vendor-owned',
    })
    vendor_id: number | null;

    @ApiProperty({ example: 'Color' })
    name: string;

    @ApiProperty({ example: 'color' })
    code: string;

    @ApiPropertyOptional({ example: 'Product color' })
    description?: string;

    @ApiProperty({ example: 'select' })
    type: string;

    @ApiProperty({ example: 0 })
    sort_order: number;

    @ApiProperty({ example: true })
    is_filterable: boolean;

    @ApiProperty({ example: true })
    is_visible: boolean;

    @ApiProperty({ example: false })
    is_variant_attribute: boolean;

    @ApiProperty({ example: false })
    is_required: boolean;

    @ApiProperty({ example: false })
    is_locked: boolean;

    @ApiProperty({ type: [AttributeValueResponseDto] })
    values: AttributeValueResponseDto[];

    @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
    created_at: Date;

    @ApiProperty({ example: '2025-01-15T10:00:00.000Z' })
    updated_at: Date;
}
