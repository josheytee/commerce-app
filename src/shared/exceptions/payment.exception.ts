// src/common/exceptions/payment.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class PaymentNotFoundException extends BaseException {
    constructor(transactionId: string) {
        super(
            `Payment with transaction ID ${transactionId} not found`,
            'PAY_404_NOT_FOUND',
            HttpStatus.NOT_FOUND,
            { transactionId },
        );
    }
}

export class PaymentVerificationFailedException extends BaseException {
    constructor(transactionId: string, reason?: string) {
        super(
            `Payment verification failed for transaction ${transactionId}${reason ? `: ${reason}` : ''}`,
            'PAY_400_VERIFICATION_FAILED',
            HttpStatus.BAD_REQUEST,
            { transactionId, reason },
        );
    }
}

export class PaymentAlreadyProcessedException extends BaseException {
    constructor(transactionId: string) {
        super(
            `Payment ${transactionId} has already been processed`,
            'PAY_409_ALREADY_PROCESSED',
            HttpStatus.CONFLICT,
            { transactionId },
        );
    }
}

export class PaymentInsufficientFundsException extends BaseException {
    constructor(amount: number, balance: number) {
        super(
            `Insufficient funds. Required: ${amount}, Available: ${balance}`,
            'PAY_402_INSUFFICIENT_FUNDS',
            HttpStatus.PAYMENT_REQUIRED,
            { amount, balance },
        );
    }
}

export class PaymentGatewayException extends BaseException {
    constructor(gateway: string, message: string) {
        super(
            `Payment gateway ${gateway} error: ${message}`,
            'PAY_500_GATEWAY_ERROR',
            HttpStatus.INTERNAL_SERVER_ERROR,
            { gateway, message },
        );
    }
}