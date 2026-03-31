import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateSectionDto {
    @ApiProperty({ example: 'Electronics' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'electronics' })
    @IsString()
    slug: string;

    @ApiPropertyOptional({
        example: 'https://cdn.com/section-cover.jpg',
    })
    @IsString()
    @IsOptional()
    cover?: string;

    @ApiPropertyOptional({
        example: 'All electronic products',
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        example: 1,
        description: 'Parent section ID (for nested sections)',
    })
    @IsNumber()
    @IsOptional()
    parent_id?: number;

    @ApiProperty({
        example: 10,
        description: 'Store ID this section belongs to',
    })
    @IsNumber()
    store_id: number;
}
