// src/modules/inventory/dto/inventory-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { StockStatusEnum } from 'src/shared';

export class InventoryQueryDto {
    @ApiPropertyOptional({ example: 42 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    variant_id?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    store_id?: number;

    @ApiPropertyOptional({ enum: StockStatusEnum })
    @IsOptional()
    @IsEnum(StockStatusEnum)
    stock_status?: StockStatusEnum;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    low_stock_only?: boolean;

    @ApiPropertyOptional({ example: 1, default: 1, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ example: 50, default: 50, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 50;
}
