// src/modules/product/dto/inventory.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class CreateInventoryDto {
    @ApiPropertyOptional({
        example: 50,
        description: 'Physical stock on hand for this variant',
        default: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    stock_quantity?: number;

    @ApiPropertyOptional({
        example: 0,
        description: 'Quantity currently held by in-flight reservations',
        default: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    reserved_quantity?: number;

    @ApiPropertyOptional({
        example: true,
        description: 'Whether this variant tracks inventory at all',
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    track_quantity?: boolean;

    @ApiPropertyOptional({
        example: false,
        description: 'Can customers buy beyond available stock?',
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    allow_backorders?: boolean;

    @ApiPropertyOptional({
        example: 5,
        description: 'Alert threshold for low-stock notifications',
        default: 5,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    low_stock_threshold?: number;
}
