// src/modules/order/dto/search-orders-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { OrderStatusEnum } from 'src/shared';

export class SearchOrdersQueryDto {
    @ApiPropertyOptional({
        enum: OrderStatusEnum,
        description: 'Filter by order status',
    })
    @IsOptional()
    @IsEnum(OrderStatusEnum)
    status?: OrderStatusEnum;

    @ApiPropertyOptional({
        example: 'ORD-20250115-0001',
        maxLength: 50,
        description: 'Filter by exact order reference',
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    order_reference?: string;
}