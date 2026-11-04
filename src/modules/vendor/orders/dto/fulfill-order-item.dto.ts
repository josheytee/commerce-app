// src/modules/order/dto/fulfill-order-item.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class FulfillOrderItemDto {
    @ApiPropertyOptional({
        example: 2,
        minimum: 1,
        description:
            'How many units to fulfill. Omit to fulfill the entire remaining quantity.',
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    quantity?: number;
}
