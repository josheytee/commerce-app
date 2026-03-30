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
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const method = request.method;
    const now = Date.now();

    return next.handle().pipe(
      map((data) => {
        const formattedData = this.formatData(data);

        const res = {
          success: true,
          message: this.getMessage(method),
          data: formattedData,

          // optional meta (very useful)
          meta: {
            statusCode: response.statusCode,
            timestamp: new Date().toISOString(),
            path: request.url,
            method,
            responseTime: `${Date.now() - now}ms`,
          },
        };

        // 🔍 Cleaner logging (avoid logging huge payloads in prod)
        this.logger.log(`${method} ${request.url} - ${res.meta.responseTime}`);

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
      case 'PATCH':
        return 'Updated successfully';
      case 'DELETE':
        return 'Deleted successfully';
      default:
        return 'Request successful';
    }
  }

  private formatData(data: any): any {
    // 🧠 Handle Sequelize pagination
    if (data && typeof data === 'object' && 'rows' in data && 'count' in data) {
      return {
        total: data.count,
        items: data.rows,
      };
    }

    return data;
  }
}
