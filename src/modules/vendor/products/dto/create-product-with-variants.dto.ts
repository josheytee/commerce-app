// import { ValidateNested, IsArray, IsOptional } from 'class-validator';
// import { Type } from 'class-transformer';
// import { CreateVariantDto } from './create-variant.dto';
// import { ApiPropertyOptional } from '@nestjs/swagger';
// import { CreateProductDto } from './create-product.dto';

// export class CreateProductWithVariantsDto extends CreateProductDto {
//   @ApiPropertyOptional({ type: [CreateVariantDto] })
//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => CreateVariantDto)
//   variants?: CreateVariantDto[];
// }


// src/modules/vendor/products/dto/create-product-with-variants.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductStatusEnum } from 'src/shared';
import { CreateVariantDto } from './create-variant.dto';

export class CreateProductWithVariantsDto {
  @ApiProperty({ example: 'Running Shoes' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'running-shoes' })
  @IsString()
  @MaxLength(255)
  slug: string;

  @ApiPropertyOptional({ example: 'Long description...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Short summary...' })
  @IsOptional()
  @IsString()
  short_description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  specification?: string;

  @ApiPropertyOptional({
    example: 'USD',
    default: 'USD',
    description: 'ISO 4217 currency code',
  })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiProperty({
    example: 99.99,
    description:
      'Base price. For simple products this becomes the default variant price.',
  })
  @IsNumber()
  @Min(0)
  base_price: number;

  @ApiPropertyOptional({ example: 149.99 })
  @IsOptional()
  @IsNumber()
  compare_at_price?: number;

  @ApiPropertyOptional({ example: 89.5 })
  @IsOptional()
  @IsNumber()
  cost_price?: number;

  @ApiPropertyOptional({ example: 50, description: 'Initial stock for simple products' })
  @IsOptional()
  @IsInt()
  @Min(0)
  initial_stock?: number;

  @ApiPropertyOptional({ example: 'SIMPLE-1-1700000000000' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ enum: ProductStatusEnum, default: ProductStatusEnum.DRAFT })
  @IsOptional()
  @IsEnum(ProductStatusEnum)
  status?: ProductStatusEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  section_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  store_id?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  is_featured?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  is_taxable?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  allow_backorders?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  meta_title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  meta_description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  meta_keywords?: string;

  @ApiPropertyOptional({
    type: [CreateVariantDto],
    description:
      'Omit entirely for a simple product — a single default variant will be created.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants?: CreateVariantDto[];
}