import { ApiProperty } from '@nestjs/swagger';

export class MetaDto {
    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({ example: '2026-03-29T12:00:00.000Z' })
    timestamp: string;

    @ApiProperty({ example: '/api/models' })
    path: string;

    @ApiProperty({ example: 'GET' })
    method: string;

    @ApiProperty({ example: 'uuid-request-id', required: false })
    requestId?: string;
}

export class ApiResponseDto<T> {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Fetched successfully' })
    message: string;

    @ApiProperty({ required: false })
    data: T;

    @ApiProperty({ type: MetaDto })
    meta: MetaDto;
}

export class PaginatedResponseDto<T> {
    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true })
    items: T[];
}

export class ApiErrorResponseDto {
    @ApiProperty({ example: false })
    success: boolean;

    @ApiProperty({ example: 'Bad Request' })
    message: string;

    @ApiProperty({ example: null })
    data: null;

    @ApiProperty({ type: MetaDto })
    meta: MetaDto;
}