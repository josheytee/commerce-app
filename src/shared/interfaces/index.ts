// Common interfaces for the application
export interface IBaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface IApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
}

export interface IUser {
    id: number;
    email: string;
    username: string;
    // role: string;
}
