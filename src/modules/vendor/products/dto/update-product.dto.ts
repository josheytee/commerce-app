// src/modules/vendor/products/dto/update-product.dto.ts
import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateProductWithVariantsDto } from './create-product-with-variants.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreateVariantDto } from './create-variant.dto';

// Everything optional except slug (which we keep required if provided) — adjust as needed
export class UpdateProductDto extends PartialType(
  OmitType(CreateProductWithVariantsDto, ['variants'] as const),
) {
  @ApiPropertyOptional({
    type: [CreateVariantDto],
    description:
      'Sync variants. Variants with an `id` are updated, without are created, and missing ones are soft-deleted.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants?: CreateVariantDto[];
}
