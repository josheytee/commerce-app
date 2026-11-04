// src/modules/order/dto/ship-order.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';

export class ShipOrderDto {
    @ApiProperty({
        example: 'TRK1234567890',
        maxLength: 100,
        description: 'Carrier tracking number',
    })
    @IsString()
    @MaxLength(100)
    tracking_number: string;

    @ApiProperty({
        example: 'DHL',
        maxLength: 100,
        description: 'Carrier name or code',
    })
    @IsString()
    @MaxLength(100)
    carrier: string;

    @ApiPropertyOptional({
        example: '2025-01-20T00:00:00.000Z',
        description: 'Estimated delivery date (ISO 8601)',
    })
    @IsOptional()
    @IsDateString()
    estimated_delivery?: string;

    @ApiPropertyOptional({
        example: 2.5,
        description: 'Package weight in kg (for carrier integration)',
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    weight?: number;
}