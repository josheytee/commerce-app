// src/modules/order/dto/create-order-direct.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { OrderItemInputDto } from './order-item-input.dto';

export class CreateOrderDirectDto {
    @ApiProperty({ type: [OrderItemInputDto] })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemInputDto)
    items: OrderItemInputDto[];

    @ApiProperty({ example: 1 })
    @IsInt()
    address_id: number;
    // shipping_address_id: number;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt()
    billing_address_id?: number;

    @ApiPropertyOptional({ example: 'SAVE10' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    coupon_code?: string;

    @ApiPropertyOptional({ example: 'Leave at the front desk' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    notes?: string;

    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Client-generated UUID. Retries with the same key return the same checkout.',
    })
    @IsUUID()
    idempotency_key: string;
}