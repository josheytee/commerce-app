// src/modules/vendor/products/attribute/dto/list-attribute.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsBoolean,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class ListAttributeDto {
    @ApiPropertyOptional({
        example: 'col',
        description: 'Case-insensitive name/code search',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    is_filterable?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    is_visible?: boolean;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    is_variant_attribute?: boolean;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    is_required?: boolean;

    @ApiPropertyOptional({ example: 20, default: 20, minimum: 1, maximum: 100 })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    @Max(100)
    limit?: number = 20;

    @ApiPropertyOptional({ example: 0, default: 0, minimum: 0 })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(0)
    offset?: number = 0;

    @ApiPropertyOptional({
        example: 'sort_order',
        default: 'sort_order',
        description: 'Sort field',
    })
    @IsOptional()
    @IsString()
    sort?: string = 'sort_order';

    @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'asc' })
    @IsOptional()
    @IsString()
    order?: 'asc' | 'desc' = 'asc';
}
