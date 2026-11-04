// src/modules/order/dto/update-order-status.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { OrderStatusEnum } from 'src/shared';

export class UpdateOrderStatusDto {
    @ApiProperty({
        enum: OrderStatusEnum,
        example: OrderStatusEnum.PROCESSING,
        description: 'Target status. Transition must be valid per the order state machine.',
    })
    @IsEnum(OrderStatusEnum)
    status: OrderStatusEnum;

    @ApiPropertyOptional({
        example: 'Manually moved to processing',
        maxLength: 500,
        description: 'Optional note attached to the status history entry',
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    reason?: string;
}
