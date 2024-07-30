import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ValidationError,
  DatabaseError,
  ForeignKeyConstraintError,
} from 'sequelize';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message;
    } else if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.errors.map((err) => err.message).join(', ');
    } else if (exception instanceof DatabaseError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
    } else if (exception instanceof ForeignKeyConstraintError) {
      status = HttpStatus.CONFLICT;
      message = 'Foreign key constraint violation';
    } else if (exception instanceof CustomException) {
      status = exception.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
    };

    this.logger.error(
      `HTTP Status: ${status} Error Message: ${JSON.stringify(errorResponse)}`,
      (exception as any).stack,
    );

    response.status(status).json(errorResponse);
  }
}

class CustomException extends HttpException {
  statusCode: HttpStatus;
  constructor(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message, statusCode);
  }
}
