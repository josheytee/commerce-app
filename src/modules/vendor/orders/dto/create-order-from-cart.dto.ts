import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateOrderFromCartDto {
    // @ApiProperty({
    //     description: 'The ID of the customer placing the order',
    //     example: 123,
    // })
    // customer_id: number;

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

    @ApiProperty({
        description: 'The ID of the shipping address for the order',
        example: 456,
    })
    shipping_address_id: number;
}
