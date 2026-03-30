import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationMetaDto {
    @ApiProperty({ example: 100, description: 'Total number of items' })
    total: number;

    @ApiProperty({ example: 1, description: 'Current page number' })
    page: number;

    @ApiProperty({ example: 20, description: 'Items per page' })
    limit: number;

    @ApiProperty({ example: 5, description: 'Total number of pages' })
    totalPages: number;

    @ApiPropertyOptional({ example: true, description: 'Has next page' })
    hasNextPage?: boolean;

    @ApiPropertyOptional({ example: false, description: 'Has previous page' })
    hasPrevPage?: boolean;
}

export class ApiResponseDto<T> {
    @ApiProperty({ example: true, description: 'Request success status' })
    success: boolean;

    @ApiProperty({
        example: 'Operation completed successfully',
        description: 'Human-readable message',
    })
    message: string;

    @ApiProperty({ description: 'Response data payload', nullable: true })
    data: T | null;

    @ApiPropertyOptional({
        description: 'Additional metadata (pagination, filters, etc.)',
    })
    meta?: PaginationMetaDto | Record<string, any>;
}

// Usage in controller
// @Get()
// async findAll(@Query() pagination: PaginationDto): Promise < ApiResponseDto < PaginatedResult < ProductListDto >>> {
//     const result = await this._service.findAll(pagination);

//     return {
//         success: true,
//         message: 'Products retrieved successfully',
//         data: result.items,
//         meta: {
//             total: result.total,
//             page: result.page,
//             limit: result.limit,
//             totalPages: Math.ceil(result.total / result.limit),
//             hasNextPage: result.page < Math.ceil(result.total / result.limit),
//             hasPrevPage: result.page > 1,
//         },
//     };
// }
