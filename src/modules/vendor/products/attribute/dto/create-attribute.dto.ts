// src/modules/attribute/dto/create-attribute.dto.ts
import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  MaxLength,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AttributeTypeEnum } from 'src/infrastructure/database/models/attribute.model';
import { CreateAttributeValueDto } from './create-attribute-value.dto';

export class CreateAttributeDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  slug?: string;

  @IsEnum(AttributeTypeEnum)
  type: AttributeTypeEnum;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  /** Optional: create values inline with the attribute. */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttributeValueDto)
  values?: CreateAttributeValueDto[];
}
