import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const method = request.method;
    const now = Date.now();

    return next.handle().pipe(
      map((data) => {
        const res = {
          statusCode: response.statusCode,
          timestamp: new Date().toISOString(),
          path: request.url,
          method: method,
          message: this.getMessage(method),
          data: this.formatData(data),
          responseTime: `${Date.now() - now}ms`,
        };

        this.logger.log(`Request: ${method} ${request.url}`);
        this.logger.log(`Response: ${JSON.stringify(res)}`);
        this.logger.log(`Response time: ${res.responseTime}`);

        return res;
      }),
    );
  }

  private getMessage(method: string): string {
    switch (method) {
      case 'GET':
        return 'Fetched successfully';
      case 'POST':
        return 'Created successfully';
      case 'PUT':
        return 'Updated successfully';
      case 'DELETE':
        return 'Deleted successfully';
      default:
        return 'Request successful';
    }
  }

  private formatData(data: any): any {
    if (
      data &&
      typeof data === 'object' &&
      data.hasOwnProperty('rows') &&
      data.hasOwnProperty('count')
    ) {
      // Handle paginated results
      return {
        total: data.count,
        items: data.rows,
      };
    }
    return data;
  }
}
