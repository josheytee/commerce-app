// src/modules/order/dto/pagination-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { OrderStatusEnum } from 'src/shared';

export class PaginationQueryDto {
    @ApiPropertyOptional({
        enum: OrderStatusEnum,
        description: 'Filter orders by status',
    })
    @IsOptional()
    @IsEnum(OrderStatusEnum)
    status?: OrderStatusEnum;

    @ApiPropertyOptional({
        example: 1,
        default: 1,
        minimum: 1,
        description: 'Page number (1-based)',
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        example: 10,
        default: 10,
        minimum: 1,
        maximum: 100,
        description: 'Items per page',
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;
}