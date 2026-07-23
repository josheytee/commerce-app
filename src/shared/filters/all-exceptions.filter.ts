// src/shared/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ValidationError,
  DatabaseError,
  ForeignKeyConstraintError,
  UniqueConstraintError,
  ConnectionError,
  TimeoutError,
} from 'sequelize';
import { BaseException, ExceptionResponse } from '../exceptions/base.exception';
import { ResponseInterceptor } from '../interceptors/response.interceptor';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { requestId?: string }>();

    const requestId = request.requestId;
    const now = Date.now();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'ERR_500_INTERNAL';
    let details: any = null;
    let errors: any[] = [];

    // 🔐 Handle Custom BaseException
    if (exception instanceof BaseException) {
      const errorResponse = exception.getResponse() as ExceptionResponse;
      status = exception.getStatus();
      message = errorResponse.message || exception.message;
      errorCode = errorResponse.errorCode || 'ERR_CUSTOM';
      details = errorResponse.details || null;
      errors = errorResponse.errors || [];
    }

    // 🔐 Handle NestJS HTTP Exceptions
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        errorCode = `HTTP_${status}`;
      } else if (typeof exceptionResponse === 'object') {
        const res: any = exceptionResponse;
        message = res.message || res.error || exception.message;
        errorCode = res.errorCode || `HTTP_${status}`;
        details = res.details || null;
        errors = res.errors || [];

        // Handle class-validator errors
        if (res.message && Array.isArray(res.message)) {
          errors = res.message.map((msg: string) => ({
            message: msg,
          }));
          message = res.message.join(', ');
        }
      }
    }

    // 🧾 Sequelize Validation Error
    else if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation error occurred';
      errorCode = 'VALIDATION_ERROR';
      errors = exception.errors.map((err) => ({
        field: err.path,
        value: err.value,
        message: err.message,
        type: err.type,
        validatorKey: err.validatorKey,
        validatorArgs: err.validatorArgs,
      }));
      details = exception.message;
    }

    // 🔑 Unique Constraint Error
    else if (exception instanceof UniqueConstraintError) {
      status = HttpStatus.CONFLICT;
      message = 'Duplicate entry found';
      errorCode = 'DUPLICATE_ENTRY';
      errors = exception.errors.map((err) => ({
        field: err.path,
        value: err.value,
        message: err.message,
        type: err.type,
      }));
      details = {
        message: exception.message,
        fields: exception.fields,
        sql: process.env.NODE_ENV === 'development' ? exception.sql : undefined,
      };
    }

    // 🧱 Foreign Key Error
    else if (exception instanceof ForeignKeyConstraintError) {
      status = HttpStatus.CONFLICT;
      message = 'Related resource not found or already in use';
      errorCode = 'FOREIGN_KEY_VIOLATION';
      details = {
        table: exception.table,
        fields: exception.fields,
        value: exception.value,
        index: exception.index,
        message: exception.message,
        sql: process.env.NODE_ENV === 'development' ? exception.sql : undefined,
      };
    }

    // 🗄 General DB Error
    else if (exception instanceof DatabaseError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Database error occurred';
      errorCode = 'DATABASE_ERROR';
      details = {
        message: exception.message,
        sql: process.env.NODE_ENV === 'development' ? exception.sql : undefined,
        parameters: process.env.NODE_ENV === 'development' ? exception.parameters : undefined,
      };
    }

    // 🔌 Connection Error
    else if (exception instanceof ConnectionError) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Database connection failed';
      errorCode = 'DB_CONNECTION_ERROR';
      details = {
        message: exception.message,
        parent: exception.parent?.message,
      };
    }

    // ⏱ Timeout Error
    else if (exception instanceof TimeoutError) {
      status = HttpStatus.REQUEST_TIMEOUT;
      message = 'Request timed out';
      errorCode = 'REQUEST_TIMEOUT';
      details = exception.message;
    }

    // 📦 Handle Unknown Errors
    else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'Internal server error';
      errorCode = 'UNKNOWN_ERROR';
      details = process.env.NODE_ENV === 'development' ? {
        name: exception.name,
        stack: exception.stack,
      } : null;
    }

    // 🔧 Normalize message
    if (Array.isArray(message)) {
      message = message.join(', ');
    }

    // 📝 Build Error Response
    const errorResponse = {
      success: false,
      message,
      errorCode,
      ...(details && { details }),
      ...(errors.length > 0 && { errors }),
      meta: {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        requestId: requestId || null,
        responseTime: `${Date.now() - now}ms`,
      },
    };

    // 🔥 Smart Logging
    const logContext = {
      requestId,
      method: request.method,
      url: request.url,
      status,
      message,
      errorCode,
      ip: request.ip,
      userAgent: request.get('user-agent'),
    };

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} ${status} - ${message}`,
        process.env.NODE_ENV === 'development'
          ? (exception as any)?.stack
          : undefined,
      );

      // Log full error details in development
      if (process.env.NODE_ENV === 'development') {
        this.logger.debug('Error details:', {
          ...logContext,
          exception: (exception as any)?.stack,
          details,
        });
      }
    } else if (status >= 400) {
      this.logger.warn(
        `${request.method} ${request.url} ${status} - ${message}`,
      );
      if (process.env.NODE_ENV === 'development') {
        this.logger.debug('Error details:', logContext);
      }
    } else {
      this.logger.log(
        `${request.method} ${request.url} ${status} - ${message}`,
      );
    }

    response.status(status).json(errorResponse);
  }
}
