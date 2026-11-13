// src/modules/attribute/dto/query-attribute.dto.ts
import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryAttributeDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    is_active?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 50;
}