// src/modules/inventory/dto/create-inventory.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsInt,
    IsObject,
    IsOptional,
    Min,
} from 'class-validator';

export class CreateInventoryDto {
    @ApiProperty({ example: 42 })
    @IsInt()
    variant_id: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    store_id: number;

    @ApiProperty({ example: 100, minimum: 0 })
    @IsInt()
    @Min(0)
    quantity: number;

    @ApiPropertyOptional({ example: 0, minimum: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    reserved_quantity?: number;

    @ApiPropertyOptional({ example: true, default: true })
    @IsOptional()
    @IsBoolean()
    track_quantity?: boolean;

    @ApiPropertyOptional({ example: false, default: false })
    @IsOptional()
    @IsBoolean()
    allow_backorders?: boolean;

    @ApiPropertyOptional({ example: 5, default: 5 })
    @IsOptional()
    @IsInt()
    @Min(0)
    low_stock_threshold?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}
