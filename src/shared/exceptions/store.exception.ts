// src/common/exceptions/store.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class StoreNotFoundException extends BaseException {
    constructor(storeId: number) {
        super(
            `Store with ID ${storeId} not found`,
            'STORE_404_NOT_FOUND',
            HttpStatus.NOT_FOUND,
            { storeId },
        );
    }
}

export class StoreByVendorNotFoundException extends BaseException {
    constructor(storeId: number, vendorId: number) {
        super(
            `Store ${storeId} not found for vendor ${vendorId}`,
            'STORE_404_VENDOR',
            HttpStatus.NOT_FOUND,
            { storeId, vendorId },
        );
    }
}

export class StoreSlugAlreadyExistsException extends BaseException {
    constructor(slug: string) {
        super(
            `Store with slug "${slug}" already exists`,
            'STORE_409_SLUG_EXISTS',
            HttpStatus.CONFLICT,
            { slug },
        );
    }
}

export class StoreNotActiveException extends BaseException {
    constructor(storeId: number) {
        super(
            `Store ${storeId} is not active`,
            'STORE_403_INACTIVE',
            HttpStatus.FORBIDDEN,
            { storeId },
        );
    }
}

export class StoreNotVerifiedException extends BaseException {
    constructor(storeId: number) {
        super(
            `Store ${storeId} is not verified`,
            'STORE_403_UNVERIFIED',
            HttpStatus.FORBIDDEN,
            { storeId },
        );
    }
}

export class StoreOwnershipException extends BaseException {
    constructor(storeId: number, vendorId: number) {
        super(
            `Store ${storeId} does not belong to vendor ${vendorId}`,
            'STORE_403_OWNERSHIP',
            HttpStatus.FORBIDDEN,
            { storeId, vendorId },
        );
    }
}

export class StoreNotAcceptingOrdersException extends BaseException {
    constructor(storeId: number) {
        super(
            `Store ${storeId} is currently not accepting orders`,
            'STORE_403_NOT_ACCEPTING',
            HttpStatus.FORBIDDEN,
            { storeId },
        );
    }
}

export class StoreMaxLimitReachedException extends BaseException {
    constructor(vendorId: number, maxStores: number) {
        super(
            `Vendor ${vendorId} has reached the maximum limit of ${maxStores} stores`,
            'STORE_409_MAX_LIMIT',
            HttpStatus.CONFLICT,
            { vendorId, maxStores },
        );
    }
}