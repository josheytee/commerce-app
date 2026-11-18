import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
import { VariantAttributeValueDto } from './variant-attribute-value.dto';
import { CreateInventoryDto } from './inventory.dto';

export class CreateVariantDto {
  @ApiPropertyOptional({
    example: 42,
    description: 'Include when updating an existing variant; omit when creating',
  })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({
    example: 'NIKE-AIR-MAX-RED-42',
    description: 'Unique per store',
  })
  @IsString()
  sku: string;

  @ApiPropertyOptional({ example: 'Red / Size 42' })
  @IsOptional()
  @IsString()
  variant_name?: string;

  @ApiProperty({ example: 129.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 149.99, nullable: true })
  @IsOptional()
  @IsNumber()
  compare_at_price?: number | null;

  @ApiPropertyOptional({ example: 89.5, nullable: true })
  @IsOptional()
  @IsNumber()
  cost_price?: number | null;

  @ApiPropertyOptional({ example: 0.5, description: 'kg' })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ example: 30, description: 'cm' })
  @IsOptional()
  @IsNumber()
  length?: number;

  @ApiPropertyOptional({ example: 20, description: 'cm' })
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiPropertyOptional({ example: 15, description: 'cm' })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether this variant needs a shipping address',
    default: true,
  })
  @IsOptional()
  requires_shipping?: boolean;

  @ApiPropertyOptional({
    example: 'standard',
    description: 'Shipping class (standard, express, free, local_pickup)',
    default: 'standard',
  })
  @IsOptional()
  @IsString()
  shipping_class?: string;

  @ApiPropertyOptional({
    type: () => CreateInventoryDto,
    description:
      'Initial inventory for this variant. Omit to initialize with quantity 0.',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateInventoryDto)
  inventory?: CreateInventoryDto;

  @ApiPropertyOptional({
    type: [VariantAttributeValueDto],
    description: 'Attributes this variant resolves to',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantAttributeValueDto)
  attribute_values?: VariantAttributeValueDto[];
}
