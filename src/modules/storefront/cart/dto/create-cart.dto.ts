import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsUUID,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
  IsInt,
  IsPositive,
  Min,
} from 'class-validator';
import { CartItemDto } from './cart-item.dto';
export class CreateCartDto {
  @ApiProperty({
    description: 'The ID of the customer',
    example: 123,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  customer_id?: number;

  @ApiProperty({
    description: 'Array of cart items',
    type: [CartItemDto],
    example: [
      {
        product_variant_id: 123,
        store_id: 45,
        quantity: 2,
      },
      {
        product_variant_id: 456,
        store_id: 45,
        quantity: 1,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  @ArrayMinSize(1, { message: 'Cart must have at least one item' })
  items: CartItemDto[];
}

export class AddToCartDto {
  @ApiProperty()
  product_variant_id: number;

  @ApiProperty()
  store_id: number;

  @ApiProperty({ example: 2 })
  quantity: number;
}

export class UpdateCartQuantityDto {
  @ApiProperty({
    description: 'The ID of the cart item',
    example: 1,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  cart_item_id: number;

  @ApiProperty({
    description: 'New quantity',
    example: 3,
    minimum: 0,
    type: Number,
  })
  @IsInt()
  @Min(0)
  quantity: number;
}
