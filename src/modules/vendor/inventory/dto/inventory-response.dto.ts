// src/modules/inventory/dto/inventory-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InventoryResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 42 })
    variant_id: number;

    @ApiProperty({ example: 1 })
    store_id: number;

    @ApiProperty({ example: 100, description: 'Physically on hand' })
    quantity: number;

    @ApiProperty({ example: 3, description: 'Held by pending carts/orders' })
    reserved_quantity: number;

    @ApiProperty({ example: 97, description: 'quantity - reserved_quantity (DB-generated)' })
    available_quantity: number;

    @ApiProperty({
        example: 'in_stock',
        enum: ['in_stock', 'low_stock', 'out_of_stock', 'backorder'],
    })
    stock_status: string;

    @ApiProperty({ example: true })
    track_quantity: boolean;

    @ApiProperty({ example: false })
    allow_backorders: boolean;

    @ApiProperty({ example: 5 })
    low_stock_threshold: number;

    @ApiPropertyOptional({ example: '2025-01-15T10:00:00.000Z' })
    created_at?: Date;

    @ApiPropertyOptional({ example: '2025-01-15T10:00:00.000Z' })
    updated_at?: Date;
}
