import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
    @ApiProperty()
    customer_id: number;

    @ApiProperty({
        example: [{ variant_id: 1, quantity: 2, store_id: 1 }],
    })
    items: {
        variant_id: number;
        quantity: number;
        store_id: number;
    }[];
}
