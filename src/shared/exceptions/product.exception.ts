import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ProductVariantNotFoundException extends BaseException {
    constructor(productVariantId: number) {
        super(
            `Product variant with ID ${productVariantId} not found`,
            'PROD_VARIANT_404_NOT_FOUND',
            HttpStatus.NOT_FOUND,
            { productVariantId },
        );
    }
}
export class ProductNotFoundException extends BaseException {
    constructor(productId: number) {
        super(
            `Product with ID ${productId} not found`,
            'PROD_404_NOT_FOUND',
            HttpStatus.NOT_FOUND,
            { productId },
        );
    }
}

export class ProductByVendorNotFoundException extends BaseException {
    constructor(productId: number, vendorId: number) {
        super(
            `Product ${productId} not found for vendor ${vendorId}`,
            'PROD_404_VENDOR',
            HttpStatus.NOT_FOUND,
            { productId, vendorId },
        );
    }
}

export class ProductSlugAlreadyExistsException extends BaseException {
    constructor(slug: string) {
        super(
            `Product with slug "${slug}" already exists`,
            'PROD_409_SLUG_EXISTS',
            HttpStatus.CONFLICT,
            { slug },
        );
    }
}

export class ProductNotPublishedException extends BaseException {
    constructor(productId: number) {
        super(
            `Product ${productId} is not published`,
            'PROD_403_NOT_PUBLISHED',
            HttpStatus.FORBIDDEN,
            { productId },
        );
    }
}

export class ProductOutOfStockException extends BaseException {
    constructor(productId: number) {
        super(
            `Product ${productId} is out of stock`,
            'PROD_409_OUT_OF_STOCK',
            HttpStatus.CONFLICT,
            { productId },
        );
    }
}

export class ProductNotActiveException extends BaseException {
    constructor(productId: number) {
        super(
            `Product ${productId} is not active`,
            'PROD_403_INACTIVE',
            HttpStatus.FORBIDDEN,
            { productId },
        );
    }
}
