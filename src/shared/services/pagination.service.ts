// src/common/services/pagination.service.ts
import { Injectable } from '@nestjs/common';
import { PaginationMetaDto, PaginationLinks } from '../dto';
import { Request } from 'express';
import { URL } from 'url';

@Injectable()
export class PaginationService {
    buildPaginationMeta(
        totalItems: number,
        page: number,
        limit: number,
        request: Request,
        queryParams?: Record<string, any>,
    ): PaginationMetaDto {
        const totalPages = Math.ceil(totalItems / limit);

        return {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            links: this.buildPaginationLinks(page, totalPages, limit, request, queryParams),
        };
    }

    private buildPaginationLinks(
        page: number,
        totalPages: number,
        limit: number,
        request: Request,
        queryParams?: Record<string, any>,
    ): PaginationLinks {
        const baseUrl = this.getBaseUrl(request);
        const params = this.getQueryParams(request, queryParams);

        return {
            first: this.buildUrl(baseUrl, { ...params, page: 1, limit }),
            previous: page > 1 ? this.buildUrl(baseUrl, { ...params, page: page - 1, limit }) : null,
            next: page < totalPages ? this.buildUrl(baseUrl, { ...params, page: page + 1, limit }) : null,
            last: this.buildUrl(baseUrl, { ...params, page: totalPages, limit }),
        };
    }

    private getBaseUrl(request: Request): string {
        const protocol = request.protocol;
        const host = request.get('host');
        const path = request.path;
        return `${protocol}://${host}${path}`;
    }

    private getQueryParams(request: Request, additionalParams?: Record<string, any>): Record<string, any> {
        const params = { ...request.query };

        // Remove pagination params from query string for clean links
        delete params.page;
        delete params.limit;

        // Add additional params
        if (additionalParams) {
            Object.assign(params, additionalParams);
        }

        return params;
    }

    private buildUrl(baseUrl: string, params: Record<string, any>): string {
        const url = new URL(baseUrl);
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                url.searchParams.set(key, String(params[key]));
            }
        });
        return url.toString();
    }
}