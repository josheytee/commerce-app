import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SectionResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Electronics' })
    name: string;

    @ApiProperty({ example: 'electronics' })
    slug: string;

    @ApiPropertyOptional({
        example: 'https://cdn.com/section-cover.jpg',
    })
    cover?: string;

    @ApiPropertyOptional({
        example: 'All electronic products',
    })
    description?: string;

    @ApiPropertyOptional({ example: 1 })
    parent_id?: number;

    @ApiProperty({ example: 10 })
    store_id: number;

    @ApiProperty({ example: '2026-03-31T10:00:00.000Z' })
    created_at: string;

    @ApiProperty({ example: '2026-03-31T10:00:00.000Z' })
    updated_at: string;
}