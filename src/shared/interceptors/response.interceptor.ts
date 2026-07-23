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
        // If response is already formatted (from controller), return as-is
        if (this.isFormattedResponse(data)) {
          if (data.meta) {
            data.meta.responseTime = `${Date.now() - now}ms`;
            data.meta.path = request.url;
            data.meta.method = method;
          }
          this.logger.log(`${method} ${request.url} - ${data.meta?.responseTime || '0ms'}`);
          return data;
        }

        // Otherwise, format the response
        const formattedData = this.formatData(data);
        const paginationMeta = this.extractPaginationMeta(data);
        const filtersMeta = this.extractFilters(data);
        const searchTerm = this.extractSearchTerm(data);
        const customMessage = this.extractCustomMessage(data);
        const additionalMeta = this.extractOtherMeta(data);

        // Build the response
        const responseData: any = {
          success: true,
          message: customMessage || this.getMessage(method),
          data: formattedData,
        };

        // Build meta - ONLY include metadata, NOT the data itself
        responseData.meta = {
          statusCode: response.statusCode,
          timestamp: new Date().toISOString(),
          path: request.url,
          method,
          responseTime: `${Date.now() - now}ms`,
        };

        // Add pagination if it exists (nested inside meta)
        if (paginationMeta) {
          responseData.meta.pagination = paginationMeta;
        }

        // Add filters if they exist (nested inside meta)
        if (filtersMeta) {
          responseData.meta.filters = filtersMeta;
        }

        // Add search term if it exists (nested inside meta)
        if (searchTerm) {
          responseData.meta.searchTerm = searchTerm;
        }

        // ✅ ONLY add additionalMeta if it has actual meta fields
        if (additionalMeta && Object.keys(additionalMeta).length > 0) {
          responseData.meta = {
            ...responseData.meta,
            ...additionalMeta,
          };
        }

        this.logger.log(`${method} ${request.url} - ${responseData.meta.responseTime}`);
        return responseData;
      }),
    );
  }

  /**
   * Check if data is already formatted as ApiResponse
   */
  private isFormattedResponse(data: any): boolean {
    return data &&
      typeof data === 'object' &&
      'success' in data &&
      'data' in data &&
      'meta' in data;
  }

  /**
   * Get default success message based on HTTP method
   */
  private getMessage(method: string): string {
    const messages: Record<string, string> = {
      GET: 'Fetched successfully',
      POST: 'Created successfully',
      PUT: 'Updated successfully',
      PATCH: 'Updated successfully',
      DELETE: 'Deleted successfully',
    };
    return messages[method] || 'Request successful';
  }

  /**
   * Format the data payload
   */
  private formatData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    // If it's an array, return as-is
    if (isArray(data)) {
      return data;
    }

    // If data has a 'data' property, use that
    if ('data' in data && !this.isPaginatedResponse(data)) {
      return data.data;
    }

    // If it's a paginated response with 'items'
    if (this.isPaginatedResponse(data)) {
      return data.items || [];
    }

    // If it's Sequelize pagination (fallback)
    if ('rows' in data && 'count' in data) {
      return data.rows;
    }

    // Return as-is
    return data;
  }

  /**
   * Check if response is paginated
   */
  private isPaginatedResponse(data: any): boolean {
    return data &&
      typeof data === 'object' &&
      'items' in data &&
      Array.isArray(data.items) &&
      'meta' in data;
  }

  /**
   * Extract pagination meta (nested approach)
   */
  private extractPaginationMeta(data: any): any {
    if (!data || typeof data !== 'object') {
      return null;
    }

    // Check for pagination in data.meta
    if ('meta' in data && data.meta) {
      const { meta } = data;
      if (meta && 'currentPage' in meta && 'totalPages' in meta) {
        return {
          currentPage: meta.currentPage,
          totalPages: meta.totalPages,
          totalItems: meta.totalItems,
          itemsPerPage: meta.itemsPerPage,
          hasNextPage: meta.hasNextPage ?? meta.currentPage < meta.totalPages,
          hasPreviousPage: meta.hasPreviousPage ?? meta.currentPage > 1,
          ...(meta.links && { links: meta.links }),
        };
      }
    }

    // Check for direct pagination object
    if ('pagination' in data && data.pagination) {
      return data.pagination;
    }

    return null;
  }

  /**
   * Extract filters meta
   */
  private extractFilters(data: any): any {
    if (!data || typeof data !== 'object') {
      return null;
    }

    if ('filters' in data && data.filters) {
      return data.filters;
    }

    return null;
  }

  /**
   * Extract search term
   */
  private extractSearchTerm(data: any): string | null {
    if (!data || typeof data !== 'object') {
      return null;
    }

    if ('searchTerm' in data && data.searchTerm) {
      return data.searchTerm;
    }

    return null;
  }

  /**
   * Extract custom message
   */
  private extractCustomMessage(data: any): string | null {
    if (!data || typeof data !== 'object') {
      return null;
    }

    if ('message' in data && data.message) {
      return data.message;
    }

    return null;
  }

  /**
   * ✅ FIXED: Extract additional meta data (ONLY meta fields, NOT data)
   */
  private extractOtherMeta(data: any): any {
    if (!data || typeof data !== 'object') {
      return null;
    }

    // Skip if data is an array
    if (isArray(data)) {
      return null;
    }

    // ✅ Only extract if there's an explicit 'meta' property
    if ('meta' in data && data.meta && typeof data.meta === 'object') {
      const { meta } = data;

      // Pagination fields to exclude from meta
      const paginationFields = [
        'currentPage',
        'totalPages',
        'totalItems',
        'itemsPerPage',
        'hasNextPage',
        'hasPreviousPage',
        'links'
      ];

      // Data fields to exclude (these are already in the data property)
      const dataFields = [
        'items',
        'data',
        'pagination',
        'filters',
        'searchTerm',
        'message',
        'rows',
        'count',
        'success',
        'statusCode',
        'timestamp',
        'path',
        'method',
        'responseTime'
      ];

      const otherMeta: any = {};

      // Only extract fields that are:
      // 1. In the meta object
      // 2. Not pagination fields
      // 3. Not data fields
      Object.keys(meta).forEach(key => {
        if (!paginationFields.includes(key) && !dataFields.includes(key)) {
          otherMeta[key] = meta[key];
        }
      });

      return Object.keys(otherMeta).length > 0 ? otherMeta : null;
    }

    // ✅ Don't extract root-level properties as meta
    // This prevents the duplication issue
    return null;
  }
}
