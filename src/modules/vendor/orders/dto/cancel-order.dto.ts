// src/modules/order/dto/cancel-order.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CancelOrderDto {
    @ApiPropertyOptional({
        example: 'Out of stock',
        maxLength: 500,
        description: 'Reason for cancellation (recorded in status history)',
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    reason?: string;
}
