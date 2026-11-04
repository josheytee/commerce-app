// src/modules/cart/dto/update-cart-item.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
    @ApiProperty({
        example: 3,
        minimum: 0,
        description: 'New quantity. Use 0 to remove the item.',
    })
    @IsInt()
    @Min(0)
    quantity: number;
}
