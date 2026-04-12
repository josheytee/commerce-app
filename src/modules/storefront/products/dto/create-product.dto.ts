
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsNumber,
    IsOptional,
    IsBoolean,
    IsDateString,
    IsEnum,
    IsArray,
    Min,
    MaxLength,
    IsUrl,
    IsPositive
} from 'class-validator';
import { ProductStatusEnum, ProductTypeEnum } from 'src/shared';

export class CreateProductDto {
    @ApiProperty({ description: 'Product name', maxLength: 255 })
    @IsString()
    @MaxLength(255)
    name: string;

    @ApiProperty({ description: 'Product slug (URL friendly)' })
    @IsString()
    slug: string;

    @ApiPropertyOptional({ description: 'Product description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'Short description' })
    @IsOptional()
    @IsString()
    short_description?: string;

    @ApiPropertyOptional({ description: 'Product specifications' })
    @IsOptional()
    @IsString()
    specification?: string;

    @ApiProperty({ description: 'Product price', minimum: 0 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiPropertyOptional({ description: 'Compare at price (original price)', minimum: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    compare_at_price?: number;

    @ApiPropertyOptional({ description: 'Cost price', minimum: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    cost_price?: number;

    @ApiPropertyOptional({ description: 'SKU' })
    @IsOptional()
    @IsString()
    sku?: string;

    @ApiPropertyOptional({ description: 'UPC code' })
    @IsOptional()
    @IsString()
    upc?: string;

    @ApiPropertyOptional({ description: 'EAN code' })
    @IsOptional()
    @IsString()
    ean?: string;

    @ApiPropertyOptional({ description: 'ISBN code' })
    @IsOptional()
    @IsString()
    isbn?: string;

    @ApiPropertyOptional({ description: 'MPN code' })
    @IsOptional()
    @IsString()
    mpn?: string;

    @ApiPropertyOptional({ enum: ProductStatusEnum, default: ProductStatusEnum.DRAFT })
    @IsOptional()
    @IsEnum(ProductStatusEnum)
    status?: ProductStatusEnum;

    @ApiPropertyOptional({ enum: ProductTypeEnum, default: ProductTypeEnum.SIMPLE })
    @IsOptional()
    @IsEnum(ProductTypeEnum)
    product_type?: ProductTypeEnum;

    @ApiPropertyOptional({ description: 'Is product featured?' })
    @IsOptional()
    @IsBoolean()
    is_featured?: boolean;

    @ApiPropertyOptional({ description: 'Is product active?' })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @ApiPropertyOptional({ description: 'Can product be reviewed?' })
    @IsOptional()
    @IsBoolean()
    review_able?: boolean;

    @ApiPropertyOptional({ description: 'Is product taxable?' })
    @IsOptional()
    @IsBoolean()
    is_taxable?: boolean;

    @ApiPropertyOptional({ description: 'SEO meta title', maxLength: 160 })
    @IsOptional()
    @IsString()
    @MaxLength(160)
    meta_title?: string;

    @ApiPropertyOptional({ description: 'SEO meta description' })
    @IsOptional()
    @IsString()
    meta_description?: string;

    @ApiPropertyOptional({ description: 'SEO meta keywords' })
    @IsOptional()
    @IsString()
    meta_keywords?: string;

    @ApiPropertyOptional({ description: 'Published date' })
    @IsOptional()
    @IsDateString()
    published_at?: Date;

    @ApiPropertyOptional({ description: 'Available from date' })
    @IsOptional()
    @IsDateString()
    available_from?: Date;

    @ApiPropertyOptional({ description: 'Available to date' })
    @IsOptional()
    @IsDateString()
    available_to?: Date;

    @ApiProperty({ description: 'Section ID' })
    @IsNumber()
    @IsPositive()
    section_id: number;

    @ApiProperty({ description: 'Store ID' })
    @IsNumber()
    @IsPositive()
    store_id: number;

    @ApiProperty({ description: 'Vendor ID' })
    @IsNumber()
    @IsPositive()
    vendor_id: number;

    @ApiPropertyOptional({ description: 'Product images URLs', type: [String] })
    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    images?: string[];
}
