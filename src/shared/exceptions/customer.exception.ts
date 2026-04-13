import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomerNotFoundException extends HttpException {
    constructor(customerId: number) {
        super(
            {
                success: false,
                message: `Customer with ID ${customerId} not found`,
                errorCode: 'CUSTOMER_404',
            },
            HttpStatus.NOT_FOUND,
        );
    }
}

