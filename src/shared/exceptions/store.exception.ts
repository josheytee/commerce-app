import { HttpException, HttpStatus } from '@nestjs/common';

export class StoreNotFoundException extends HttpException {
    constructor(storeId: number) {
        super(
            {
                success: false,
                message: `Store with ID ${storeId} not found`,
                errorCode: 'STORE_404',
            },
            HttpStatus.NOT_FOUND,
        );
    }
}
