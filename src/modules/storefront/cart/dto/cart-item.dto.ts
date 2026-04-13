import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsOptional, Min } from 'class-validator';

export class CartItemDto {
    @ApiProperty({
        description: 'The ID of the product variant',
        example: 123,
        type: Number,
    })
    @IsInt()
    @IsPositive()
    product_variant_id: number;

    @ApiProperty({
        description: 'The ID of the store',
        example: 45,
        type: Number,
    })
    @IsInt()
    @IsPositive()
    store_id: number;

    @ApiProperty({
        description: 'Quantity of the product',
        example: 2,
        minimum: 1,
        type: Number,
    })
    @IsInt()
    @Min(1)
    quantity: number;
}

export class UpdateCartItemDto extends CartItemDto {
    @ApiProperty({
        description: 'The ID of the cart item to update',
        example: 1,
        type: Number,
    })
    @IsInt()
    @IsPositive()
    id: number;
}
