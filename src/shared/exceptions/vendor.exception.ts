import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class VendorNotFoundException extends BaseException {
    constructor(vendorId: number) {
        super(
            `Vendor with ID ${vendorId} not found`,
            'VENDOR_404_NOT_FOUND',
            HttpStatus.NOT_FOUND,
            { vendorId },
        );
    }
}

export class VendorNotVerifiedException extends BaseException {
    constructor(vendorId: number) {
        super(
            `Vendor ${vendorId} is not verified`,
            'VENDOR_403_UNVERIFIED',
            HttpStatus.FORBIDDEN,
            { vendorId },
        );
    }
}

export class VendorNotActiveException extends BaseException {
    constructor(vendorId: number) {
        super(
            `Vendor ${vendorId} is not active`,
            'VENDOR_403_INACTIVE',
            HttpStatus.FORBIDDEN,
            { vendorId },
        );
    }
}

export class VendorSuspendedException extends BaseException {
    constructor(vendorId: number, reason?: string) {
        super(
            `Vendor ${vendorId} is suspended${reason ? `: ${reason}` : ''}`,
            'VENDOR_403_SUSPENDED',
            HttpStatus.FORBIDDEN,
            { vendorId, reason },
        );
    }
}

export class VendorDocumentMissingException extends BaseException {
    constructor(vendorId: number, documentType: string) {
        super(
            `Missing required document: ${documentType} for vendor ${vendorId}`,
            'VENDOR_400_MISSING_DOC',
            HttpStatus.BAD_REQUEST,
            { vendorId, documentType },
        );
    }
}

export class VendorDocumentExpiredException extends BaseException {
    constructor(vendorId: number, documentType: string) {
        super(
            `Document ${documentType} has expired for vendor ${vendorId}`,
            'VENDOR_403_DOC_EXPIRED',
            HttpStatus.FORBIDDEN,
            { vendorId, documentType },
        );
    }
}
