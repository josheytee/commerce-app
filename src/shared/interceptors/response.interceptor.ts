// interceptors/response.interceptor.ts
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
import { isArray } from 'class-validator';
// import { PaginatedResponse } from '../interfaces/paginated-response.interface';

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
        const paginationMeta = this.extractPaginationMeta(data);
        const metaData = this.extractOtherMeta(data);
        const customMessage = this.extractCustomMessage(data);

        const res = {
          success: true,
          message: customMessage || this.getMessage(method),
          data: formattedData,
          meta: {
            statusCode: response.statusCode,
            timestamp: new Date().toISOString(),
            path: request.url,
            method,
            responseTime: `${Date.now() - now}ms`,
            ...metaData,
            ...(paginationMeta && { pagination: paginationMeta }),
          },
        };

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
    // Handle paginated responses from service layer
    if (data && typeof data === 'object' && 'items' in data && 'meta' in data) {
      const { items, meta, ...rest } = data;
      if (isArray(items)) {
        return [...items];
      } else {
        return {
          ...items,
          ...rest,
        };
      }
    }

    // Handle Sequelize pagination (fallback)
    if (data && typeof data === 'object' && 'rows' in data && 'count' in data) {
      return {
        total: data.count,
        items: data.rows,
      };
    }

    if (data && typeof data === 'object' && 'data' in data) {
      return data.data;
    }

    return data;
  }

  private extractOtherMeta(data: any): any {
    // Extract pagination meta from service layer response
    if (data && typeof data === 'object' && 'meta' in data) {
      const { meta } = data;
      return {
        ...meta,
      };
    }

    return null;
  }

  private extractPaginationMeta(data: any): any {
    // Extract pagination meta from service layer response
    if (data && typeof data === 'object' && 'meta' in data) {
      const { meta } = data;
      if (meta && 'currentPage' in meta && 'totalPages' in meta) {
        return {
          currentPage: meta.currentPage,
          totalPages: meta.totalPages,
          totalItems: meta.totalItems,
          itemsPerPage: meta.itemsPerPage,
        };
      }
    }
    return null;
  }

  private extractCustomMessage(data: any): string | null {
    if (data && typeof data === 'object' && 'message' in data) {
      return data.message;
    }
    return null;
  }
}
