import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class VariantAttributeValueDto {
  @IsInt()
  attribute_id: number;

  @IsInt()
  attribute_value_id: number;
}

export class CreateVariantDto {
  // Present only when updating an existing variant
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  variant_name?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  compare_at_price?: number | null;

  @IsOptional()
  @IsNumber()
  cost_price?: number | null;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  length?: number;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  initial_stock?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantAttributeValueDto)
  attribute_values?: VariantAttributeValueDto[];
}
