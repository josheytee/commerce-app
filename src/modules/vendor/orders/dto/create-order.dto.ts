import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
    @ApiProperty({
        description: 'The ID of the customer placing the order',
        example: 123,
    })
    customer_id: number;

    @ApiProperty({
        description: 'List of items to include in the order',
        example: [{ variant_id: 1, quantity: 2, store_id: 1 }],
    })
    items: {
        variant_id: number;
        quantity: number;
        store_id: number;
    }[];

    @ApiProperty({
        description: 'The ID of the shipping address for the order',
        example: 456,
    })
    address_id: number;

}
