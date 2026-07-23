import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

// Address Not Found
export class AddressNotFoundException extends BaseException {
    constructor(addressId: number) {
        super(
            `Address with ID ${addressId} not found`,
            'ADDR_404_NOT_FOUND',
            HttpStatus.NOT_FOUND,
        );
    }
}

export class CustomerAddressNotFoundException extends BaseException {
    constructor(addressId: number, customerId: number) {
        super(
            `Address ${addressId} not found for customer ${customerId}`,
            'ADDR_404_CUSTOMER',
            HttpStatus.NOT_FOUND,
            { addressId, customerId }
        );
    }
}

export class StoreAddressNotFoundException extends BaseException {
    constructor(addressId: number, storeId: number) {
        super(
            `Address ${addressId} not found for store ${storeId}`,
            'ADDR_404_STORE',
            HttpStatus.NOT_FOUND,
            { addressId, storeId }
        );
    }
}

// Address Validation Errors
export class AddressValidationException extends BaseException {
    constructor(message: string, details?: any) {
        super(
            message || 'Invalid address data',
            'ADDR_400_VALIDATION',
            HttpStatus.BAD_REQUEST,
            details,
        );
    }
}

export class AddressMissingFieldsException extends BaseException {
    constructor(missingFields: string[]) {
        super(
            `Missing required fields: ${missingFields.join(', ')}`,
            'ADDR_400_MISSING_FIELDS',
            HttpStatus.BAD_REQUEST,
            { missingFields },
        );
    }
}

export class AddressInvalidZipCodeException extends BaseException {
    constructor(zipCode: string) {
        super(
            `Invalid zip code format: ${zipCode}`,
            'ADDR_400_INVALID_ZIP',
            HttpStatus.BAD_REQUEST,
            { zipCode },
        );
    }
}

export class AddressInvalidPhoneException extends BaseException {
    constructor(phone: string) {
        super(
            `Invalid phone number format: ${phone}`,
            'ADDR_400_INVALID_PHONE',
            HttpStatus.BAD_REQUEST,
            { phone },
        );
    }
}

// Address Conflict Errors
export class AddressAlreadyExistsException extends BaseException {
    constructor(addressId: number, addressableType: string) {
        super(
            `Address ${addressId} already exists for this ${addressableType}`,
            'ADDR_409_ALREADY_EXISTS',
            HttpStatus.CONFLICT,
            { addressId, addressableType },
        );
    }
}

export class AddressDefaultAlreadySetException extends BaseException {
    constructor(addressableType: string) {
        super(
            `A default address already exists for this ${addressableType}`,
            'ADDR_409_DEFAULT_EXISTS',
            HttpStatus.CONFLICT,
            { addressableType },
        );
    }
}

export class AddressInUseException extends BaseException {
    constructor(addressId: number) {
        super(
            `Address ${addressId} is in use and cannot be deleted`,
            'ADDR_409_IN_USE',
            HttpStatus.CONFLICT,
            { addressId },
        );
    }
}
