// dto/attribute/create-attribute.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  MaxLength,
  Min,
} from 'class-validator';
import { AttributeTypeEnum } from 'src/shared';

export class CreateAttributeDto {
  @ApiProperty({
    description: 'Attribute name',
    example: 'Color',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Attribute code (URL-friendly)',
    example: 'color',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  code: string;

  @ApiPropertyOptional({ description: 'Attribute description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Attribute type',
    enum: AttributeTypeEnum,
    example: AttributeTypeEnum.SELECT,
    default: AttributeTypeEnum.SELECT,
  })
  @IsEnum(AttributeTypeEnum)
  type: AttributeTypeEnum;

  @ApiPropertyOptional({
    description: 'Sort order for display',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sort_order?: number;

  @ApiPropertyOptional({
    description: 'Show in sidebar filters?',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_filterable?: boolean;

  @ApiPropertyOptional({
    description: 'Show on product page?',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_visible?: boolean;

  @ApiPropertyOptional({
    description: 'Can be used for product variants?',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_variant_attribute?: boolean;

  @ApiPropertyOptional({
    description: 'Is this attribute required?',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_required?: boolean;
}
