import { ApiProperty } from '@nestjs/swagger';

import {
    IsArray,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
    @IsNumber()
    variant_id: number;

    @IsNumber()
    quantity: number;

    @IsNumber()
    store_id: number;

    @IsNumber()
    vendor_id: number;

    @IsNumber()
    product_id: number;
}

export class CreateOrderDto {
    @IsNumber()
    @ApiProperty({
        description: 'The ID of the customer placing the order',
        example: 123,
    })
    customer_id: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    @ApiProperty({
        description: 'List of items to include in the order',
        example: [
            { variant_id: 1, quantity: 2, store_id: 1, vendor_id: 1, product_id: 2 },
        ],
    })
    items: OrderItemDto[];

    @ApiProperty({
        description: 'The ID of the shipping address for the order',
        example: 456,
    })
    @IsNumber()
    address_id: number;

    @IsOptional()
    @IsString()
    shipping_method?: 'standard' | 'express' | 'same_day';

    @IsOptional()
    @IsString()
    coupon_code?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
