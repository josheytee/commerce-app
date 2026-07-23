// src/common/exceptions/base.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export interface ExceptionResponse {
    success: boolean;
    message: string;
    errorCode: string;
    details?: any;
    timestamp?: string;
    path?: string;
    errors?: [];
}

export abstract class BaseException extends HttpException {
    constructor(
        message: string,
        errorCode: string,
        statusCode: HttpStatus,
        details?: any,
    ) {
        const response: ExceptionResponse = {
            success: false,
            message,
            errorCode,
            timestamp: new Date().toISOString(),
            ...(details && { details }),
        };
        super(response, statusCode);
    }
}
