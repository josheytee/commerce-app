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
} from 'sequelize';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { requestId?: string }>();

    const requestId = request.requestId;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let details: string | undefined;
    let errors: any[] = [];
    // console.log('Exception caught by AllExceptionsFilter:', {
    //   name: (exception as any)?.name,
    //   message: (exception as any)?.message,
    //   stack: (exception as any)?.stack,
    //   ...(exception instanceof HttpException && {
    //     statusCode: exception.getStatus(),
    //     response: exception.getResponse(),
    //   }),
    // });
    // 🔐 Handle NestJS HTTP Exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const res: any = exceptionResponse;
        message = res.message || res.error || message;
      }
    }

    // 🧾 Sequelize Validation Error
    else if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      errors = exception.errors;
      // message = exception.errors.map((err) => err.message);
    }

    // 🧱 Foreign Key Error
    else if (exception instanceof ForeignKeyConstraintError) {
      status = HttpStatus.CONFLICT;
      message = 'Related resource not found or already in use';
    }

    // 🗄 General DB Error
    else if (exception instanceof DatabaseError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Database error occurred';
      details = exception.message;
    }

    // 🧠 Custom App Exception
    else if (exception instanceof JartException) {
      status = exception.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
    }

    // 🧾 Normalize message
    if (Array.isArray(message)) {
      message = message.join(', ');
    }

    const errorResponse = {
      success: false,
      message,
      data: null,
      meta: {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        requestId,
        details,
        errors
      },
    };

    // 🔥 Smart Logging
    this.logger.error(
      `${request.method} ${request.url} ${status} - ${message}`,
      process.env.NODE_ENV === 'development'
        ? (exception as any)?.stack
        : undefined,
    );

    response.status(status).json(errorResponse);
  }
}

export class JartException extends HttpException {
  statusCode: number;

  constructor(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message, statusCode);
    this.statusCode = statusCode;
  }
}
