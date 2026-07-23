// src/common/exceptions/cart.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class CartNotFoundException extends BaseException {
    constructor(customerId: number) {
        super(
            `Cart not found for customer ${customerId}`,
            'CART_404_NOT_FOUND',
            HttpStatus.NOT_FOUND,
            { customerId },
        );
    }
}

export class CartItemNotFoundException extends BaseException {
    constructor(itemId: number) {
        super(
            `Cart item with ID ${itemId} not found`,
            'CART_404_ITEM_NOT_FOUND',
            HttpStatus.NOT_FOUND,
            { itemId },
        );
    }
}

export class CartItemQuantityExceededException extends BaseException {
    constructor(productId: number, maxQuantity: number, requestedQuantity: number) {
        super(
            `Cannot add ${requestedQuantity} items. Maximum ${maxQuantity} allowed for product ${productId}`,
            'CART_400_QUANTITY_EXCEEDED',
            HttpStatus.BAD_REQUEST,
            { productId, maxQuantity, requestedQuantity },
        );
    }
}

export class CartEmptyException extends BaseException {
    constructor(customerId: number) {
        super(
            `Cart is empty for customer ${customerId}`,
            'CART_400_EMPTY',
            HttpStatus.BAD_REQUEST,
            { customerId },
        );
    }
}