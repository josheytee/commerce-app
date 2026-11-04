// src/modules/vendor/products/attribute/dto/create-attribute.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { AttributeTypeEnum } from 'src/shared';

export class CreateAttributeDto {
  @ApiProperty({ example: 'Color' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'color', description: 'URL-safe, unique per vendor' })
  @IsString()
  @MaxLength(100)
  code: string;

  @ApiPropertyOptional({ example: 'Product color' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: AttributeTypeEnum, default: AttributeTypeEnum.SELECT })
  @IsOptional()
  @IsEnum(AttributeTypeEnum)
  type?: AttributeTypeEnum;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  is_filterable?: boolean;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  is_visible?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  is_variant_attribute?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  is_required?: boolean;
}
