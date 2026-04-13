import { HttpException, HttpStatus } from '@nestjs/common';

export class AddressNotFoundException extends HttpException {
    constructor(addressId: number) {
        super(
            {
                success: false,
                message: `Address with ID ${addressId} not found`,
                errorCode: 'ADDR_404',
            },
            HttpStatus.NOT_FOUND,
        );
    }
}

export class CustomerAddressNotFoundException extends HttpException {
    constructor(addressId: number, customerId: number) {
        super(
            {
                success: false,
                message: `Address ${addressId} not found for customer ${customerId}`,
                errorCode: 'ADDR_404_CUSTOMER',
            },
            HttpStatus.NOT_FOUND,
        );
    }
}
export class StoreAddressNotFoundException extends HttpException {
    constructor(addressId: number, storeId: number) {
        super(
            {
                success: false,
                message: `Address ${addressId} not found for store ${storeId}`,
                errorCode: 'ADDR_404_STORE',
            },
            HttpStatus.NOT_FOUND,
        );
    }
}

export class DefaultAddressRequiredException extends HttpException {
    constructor() {
        super(
            {
                success: false,
                message: 'At least one default address is required',
                errorCode: 'ADDR_400_DEFAULT_REQUIRED',
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}

export class InvalidAddressTypeException extends HttpException {
    constructor(type: string, allowedTypes: string[]) {
        super(
            {
                success: false,
                message: `Invalid address type: ${type}`,
                allowedTypes,
                errorCode: 'ADDR_400_INVALID_TYPE',
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
