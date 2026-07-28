// dto/vendor-filter.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsOptional,
    IsString,
    IsNumber,
    IsBoolean,
    IsEnum,
    Min,
    Max,
    IsDateString,
    IsInt,
    MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum VendorStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
    INACTIVE = 'inactive',
}

export enum VendorSortBy {
    BUSINESS_NAME = 'business_name',
    RATING_AVERAGE = 'rating_average',
    TOTAL_RATINGS = 'total_ratings',
    TOTAL_REVIEWS = 'total_reviews',
    CREATED_AT = 'created_at',
    UPDATED_AT = 'updated_at',
}

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class VendorFilterDto {
    @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Items per page',
        default: 10,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiPropertyOptional({
        description: 'Search by business name, email, phone, or description',
    })
    @IsOptional()
    @IsString()
    @MinLength(2)
    search?: string;

    @ApiPropertyOptional({
        description: 'Filter by vendor status',
        enum: VendorStatus,
    })
    @IsOptional()
    @IsEnum(VendorStatus)
    status?: VendorStatus;

    @ApiPropertyOptional({ description: 'Filter by category ID' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    categoryId?: number;

    @ApiPropertyOptional({ description: 'Filter by user ID' })
    @IsOptional()
    @Type(() => Number)
    @IsBoolean()
    userId?: number;

    @ApiPropertyOptional({ description: 'Filter by verification status' })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isVerified?: boolean;

    @ApiPropertyOptional({ description: 'Filter by featured status' })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isFeatured?: boolean;

    @ApiPropertyOptional({
        description: 'Sort field',
        enum: VendorSortBy,
        default: VendorSortBy.CREATED_AT,
    })
    @IsOptional()
    @IsEnum(VendorSortBy)
    sortBy?: VendorSortBy = VendorSortBy.CREATED_AT;

    @ApiPropertyOptional({
        description: 'Sort order',
        enum: SortOrder,
        default: SortOrder.DESC,
    })
    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder = SortOrder.DESC;

    @ApiPropertyOptional({
        description: 'Minimum rating',
        minimum: 0,
        maximum: 5,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(5)
    minRating?: number;

    @ApiPropertyOptional({
        description: 'Maximum rating',
        minimum: 0,
        maximum: 5,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(5)
    maxRating?: number;

    @ApiPropertyOptional({ description: 'Minimum number of reviews' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    minReviews?: number;

    @ApiPropertyOptional({
        description: 'Start date for created_at (ISO format)',
    })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ description: 'End date for created_at (ISO format)' })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiPropertyOptional({ description: 'Filter vendors with stores' })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    hasStores?: boolean;

    @ApiPropertyOptional({ description: 'Filter vendors with orders' })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    hasOrders?: boolean;

    @ApiPropertyOptional({ description: 'Best selling vendors (by order count)' })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    bestSellers?: boolean;

    @ApiPropertyOptional({
        description: 'Most active vendors (recently updated)',
    })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    mostActive?: boolean;

    @ApiPropertyOptional({ description: 'New vendors (created in last 30 days)' })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    newVendors?: boolean;

    @ApiPropertyOptional({ description: 'Featured vendors' })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    featured?: boolean;
}
