import { Injectable } from '@nestjs/common';

// Base abstract service for shared functionality
@Injectable()
export abstract class BaseService<T> {
    abstract findAll(): Promise<T[]>;
    abstract findOne(id: string): Promise<T>;
    abstract create(dto: any): Promise<T>;
    abstract update(id: string, dto: any): Promise<T>;
    abstract delete(id: string): Promise<boolean>;
}
