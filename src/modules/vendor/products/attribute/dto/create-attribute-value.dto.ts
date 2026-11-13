// src/modules/attribute/dto/create-attribute-value.dto.ts
import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAttributeValueDto {
  @IsString()
  @MaxLength(100)
  value: string;

  @IsString()
  @MaxLength(150)
  display_value: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  color_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  swatch_image_url?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
