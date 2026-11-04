// src/modules/order/dto/vendor-orders-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { OrderStatusEnum } from 'src/shared';

export class VendorOrdersQueryDto {
    @ApiPropertyOptional({
        enum: OrderStatusEnum,
        description: 'Filter by order status',
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
        example: 20,
        default: 20,
        minimum: 1,
        maximum: 100,
        description: 'Items per page',
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;
}
