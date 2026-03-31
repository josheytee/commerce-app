import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsNumber,
    IsOptional,
    IsPositive,
    Length,
    Matches,
} from 'class-validator';
import { REGEX_PATTERNS } from 'src/shared/constants';

export class CreateProductDto {
    @ApiProperty({
        description: 'ProductModel name',
        example: 'Premium Wireless Headphones',
        minLength: 3,
        maxLength: 255,
    })
    @IsString()
    @Length(3, 255)
    name: string;

    @ApiProperty({
        description: 'URL-friendly product identifier',
        example: 'premium-wireless-headphones',
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
    })
    @IsString()
    @Matches(REGEX_PATTERNS.SLUG, {
        message: 'Slug must be lowercase alphanumeric with hyphens only',
    })
    slug: string;

    @ApiProperty({
        description: 'ProductModel price in store currency',
        example: 99.99,
        minimum: 0,
        type: Number,
    })
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiProperty({
        description: 'Detailed product description',
        example:
            'High-quality wireless headphones with active noise cancellation...',
        required: false,
        nullable: true,
    })
    @IsOptional()
    @IsString()
    details?: string;

    @ApiProperty({
        description: 'Associated store ID',
        example: 1,
        type: Number,
    })
    @IsNumber()
    @IsPositive()
    storeId: number;

    @ApiPropertyOptional({
        description: 'ProductModel section/category within store',
        example: 5,
        type: Number,
    })
    @IsOptional()
    @IsNumber()
    sectionId?: number;

    @ApiPropertyOptional({
        description: 'Initial stock quantity',
        example: 100,
        minimum: 0,
        default: 0,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    stockQuantity?: number;

    @ApiPropertyOptional({
        description: 'ProductModel attributes for filtering',
        example: { color: 'black', material: 'plastic' },
        type: 'object',
        additionalProperties: true,
    })
    @IsOptional()
    attributes?: Record<string, string>;
}
