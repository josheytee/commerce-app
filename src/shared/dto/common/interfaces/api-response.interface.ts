// src/common/interfaces/api-response.interface.ts
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    pagination?: PaginationMeta;
    filters?: FilterMeta;
    meta: RequestMeta;
    errors?: ApiError[];
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    links?: PaginationLinks;
}

export interface PaginationLinks {
    first: string | null;
    previous: string | null;
    next: string | null;
    last: string | null;
}

export interface FilterMeta {
    applied: Record<string, any>;
    available?: Record<string, any>;
}

export interface RequestMeta {
    statusCode: number;
    timestamp: string;
    path: string;
    method: string;
    responseTime: string;
    [key: string]: any;
}

export interface ApiError {
    code: string;
    message: string;
    field?: string;
    details?: any;
}