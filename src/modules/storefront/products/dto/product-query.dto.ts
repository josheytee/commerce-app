
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max, IsIn, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum ProductSortField {
    NAME = 'name',
    PRICE = 'base_price',
    CREATED_AT = 'created_at',
    SALES_COUNT = 'sales_count',
    VIEWS = 'views',
    RATING = 'rating',
    TOTAL_RATINGS = 'total_ratings',
}

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export enum ProductFilterType {
    FLASH_DEALS = 'flash-deals',
    BEST_SELLERS = 'best-sellers',
    MOST_POPULAR = 'most-popular',
    TOP_RATED = 'top-rated',
    NEW_ARRIVALS = 'new-arrivals',
    FEATURED = 'featured',
}

export class ProductQueryDto {
    @ApiPropertyOptional({ description: 'Search keyword', example: 'laptop' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Category/Section ID', example: 5 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    categoryId?: number;

    @ApiPropertyOptional({ description: 'Vendor ID', example: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    vendorId?: number;

    @ApiPropertyOptional({ description: 'Store ID', example: 3 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    storeId?: number;

    @ApiPropertyOptional({
        enum: ProductFilterType,
        description: 'Pre-defined filter type'
    })
    @IsOptional()
    @IsEnum(ProductFilterType)
    filter?: ProductFilterType;

    @ApiPropertyOptional({
        enum: ProductSortField,
        default: ProductSortField.CREATED_AT,
        description: 'Field to sort by'
    })
    @IsOptional()
    @IsEnum(ProductSortField)
    sortBy?: ProductSortField = ProductSortField.CREATED_AT;

    @ApiPropertyOptional({
        enum: SortOrder,
        default: SortOrder.DESC,
        description: 'Sort order'
    })
    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder = SortOrder.DESC;

    @ApiPropertyOptional({
        minimum: 1,
        default: 1,
        description: 'Page number'
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        minimum: 1,
        maximum: 100,
        default: 20,
        description: 'Items per page'
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 20;

    @ApiPropertyOptional({
        description: 'Fields to select (comma-separated)',
        example: 'id,name,base_price'
        // thumbnail_url
    })
    @IsOptional()
    @IsString()
    fields?: string;

    @ApiPropertyOptional({
        description: 'Minimum price filter',
        example: 100
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @ApiPropertyOptional({
        description: 'Maximum price filter',
        example: 1000
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @ApiPropertyOptional({
        description: 'Minimum rating filter',
        example: 4
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(5)
    minRating?: number;

    @ApiPropertyOptional({
        description: 'Stock status',
        example: true
    })
    @IsOptional()
    @Type(() => Boolean)
    inStock?: boolean;

    @ApiPropertyOptional({
        description: 'Include related data (comma-separated)',
        example: 'variants,reviews,vendor'
    })
    @IsOptional()
    @IsString()
    include?: string;
}

// dto/paginated-response.dto.ts
export class PaginatedResponseDto<T> {
    items: T[];
    meta: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
    links?: {
        first?: string;
        previous?: string;
        next?: string;
        last?: string;
    };
}

// dto/product-list-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from '.';

export class ProductListResponseDto {
    @ApiProperty({ type: [ProductResponseDto] })
    items: ProductResponseDto[];

    @ApiProperty()
    meta: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };

    @ApiProperty({ required: false })
    filters?: {
        appliedFilters: Record<string, any>;
        availableFilters?: Record<string, any>;
    };

    @ApiProperty({ required: false })
    searchTerm?: string;
}
