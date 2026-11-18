// src/modules/inventory/dto/store-inventory-row.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StoreInventoryRowDto {
    @ApiProperty({ example: 1 })
    inventory_id: number;

    @ApiProperty({ example: 42 })
    variant_id: number;

    @ApiPropertyOptional({ example: 'Red / Size 42' })
    variant_name?: string;

    @ApiProperty({ example: 'SKU-001' })
    sku: string;

    @ApiPropertyOptional({ example: 'Running Shoes' })
    product_name?: string;

    @ApiProperty({ example: 100 })
    stock_quantity: number;

    @ApiProperty({ example: 3 })
    reserved_quantity: number;

    @ApiProperty({ example: 97 })
    available_quantity: number;

    @ApiProperty({ example: 'in_stock' })
    stock_status: string;

    @ApiProperty({ example: false })
    allow_backorders: boolean;

    @ApiProperty({ example: 5 })
    low_stock_threshold: number;

    @ApiPropertyOptional({ example: '2025-01-15T10:00:00.000Z' })
    updated_at?: Date;
}
