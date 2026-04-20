import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderFromCartDto {
    // @ApiProperty({
    //     description: 'The ID of the customer placing the order',
    //     example: 123,
    // })
    // customer_id: number;

    @ApiProperty({
        description: 'The ID of the shipping address for the order',
        example: 456,
    })
    address_id: number;
}
