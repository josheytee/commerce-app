// src/modules/inventory/dto/vendor-store-inventory-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { StockStatusEnum } from 'src/shared';

export class VendorStoreInventoryQueryDto {
    @ApiPropertyOptional({ example: 'red', description: 'Search by SKU or variant name' })
    @IsOptional()
    @IsString()
    search?: string;

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
