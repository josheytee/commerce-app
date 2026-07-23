// src/common/exceptions/order.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class OrderNotFoundException extends BaseException {
    constructor(orderId: number) {
        super(
            `Order with ID ${orderId} not found`,
            'ORDER_404_NOT_FOUND',
            HttpStatus.NOT_FOUND,
            { orderId },
        );
    }
}

export class OrderByCustomerNotFoundException extends BaseException {
    constructor(orderId: number, customerId: number) {
        super(
            `Order ${orderId} not found for customer ${customerId}`,
            'ORDER_404_CUSTOMER',
            HttpStatus.NOT_FOUND,
            { orderId, customerId },
        );
    }
}

export class OrderByVendorNotFoundException extends BaseException {
    constructor(orderId: number, vendorId: number) {
        super(
            `Order ${orderId} not found for vendor ${vendorId}`,
            'ORDER_404_VENDOR',
            HttpStatus.NOT_FOUND,
            { orderId, vendorId },
        );
    }
}

export class OrderInvalidStatusTransitionException extends BaseException {
    constructor(currentStatus: string, newStatus: string) {
        super(
            `Cannot transition order from ${currentStatus} to ${newStatus}`,
            'ORDER_400_INVALID_TRANSITION',
            HttpStatus.BAD_REQUEST,
            { currentStatus, newStatus },
        );
    }
}

export class OrderCannotBeCancelledException extends BaseException {
    constructor(orderId: number, status: string) {
        super(
            `Order ${orderId} cannot be cancelled because it is ${status}`,
            'ORDER_400_CANNOT_CANCEL',
            HttpStatus.BAD_REQUEST,
            { orderId, status },
        );
    }
}

export class OrderPaymentRequiredException extends BaseException {
    constructor(orderId: number) {
        super(
            `Payment is required for order ${orderId}`,
            'ORDER_402_PAYMENT_REQUIRED',
            HttpStatus.PAYMENT_REQUIRED,
            { orderId },
        );
    }
}