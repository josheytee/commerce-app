// src/common/dto/base-pagination.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsOptional,
    IsNumber,
    Min,
    Max,
    IsString,
    IsIn,
} from 'class-validator';

export class BasePaginationQueryDto {
    @ApiPropertyOptional({
        description: 'Page number',
        default: 1,
        minimum: 1,
        example: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Items per page',
        default: 20,
        minimum: 1,
        maximum: 100,
        example: 20,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 20;

    @ApiPropertyOptional({
        description: 'Sort field',
        example: 'created_at',
    })
    @IsOptional()
    @IsString()
    sortBy?: string = 'created_at';

    @ApiPropertyOptional({
        description: 'Sort order',
        enum: ['ASC', 'DESC'],
        default: 'DESC',
        example: 'DESC',
    })
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class PaginationMetaDto {
    @ApiProperty({ example: 1 })
    currentPage: number;

    @ApiProperty({ example: 10 })
    totalPages: number;

    @ApiProperty({ example: 195 })
    totalItems: number;

    @ApiProperty({ example: 20 })
    itemsPerPage: number;

    @ApiProperty({ example: true })
    hasNextPage: boolean;

    @ApiProperty({ example: false })
    hasPreviousPage: boolean;

    @ApiPropertyOptional({
        type: 'object',
        properties: {
            first: { type: 'string', nullable: true },
            previous: { type: 'string', nullable: true },
            next: { type: 'string', nullable: true },
            last: { type: 'string', nullable: true },
        },
    })
    links?: {
        first: string | null;
        previous: string | null;
        next: string | null;
        last: string | null;
    };
}
