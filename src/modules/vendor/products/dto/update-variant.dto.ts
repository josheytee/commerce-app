import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
  IsBoolean,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO for individual attribute value reference
export class VariantAttributeValueDto {
  @ApiProperty({
    example: 1,
    description: 'Attribute ID (e.g., color attribute)',
  })
  @IsInt()
  @Type(() => Number)
  attribute_id: number;

  @ApiProperty({
    example: 5,
    description: 'Attribute value ID (e.g., red color value)',
  })
  @IsInt()
  @Type(() => Number)
  attribute_value_id: number;
}

export class CreateVariantDto {
  @ApiProperty({ example: 'NIKE-AM-42-BLK', description: 'Unique SKU' })
  @IsString()
  sku: string;

  @ApiPropertyOptional({
    example: '1234567890123',
    description: 'EAN/UPC barcode',
  })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({
    example: '1234567890',
    description: 'Manufacturer Part Number',
  })
  @IsOptional()
  @IsString()
  mpn?: string;

  @ApiPropertyOptional({
    example: 'Black / Size 42 / Leather',
    description: 'Auto-generated or custom display name',
  })
  @IsOptional()
  @IsString()
  variant_name?: string;

  @ApiPropertyOptional({
    example: 99.99,
    description: 'Variant-specific price (null = inherit from product)',
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    example: 129.99,
    description: 'Compare-at price for discounts',
  })
  @IsOptional()
  @IsNumber()
  compare_at_price?: number;

  @ApiPropertyOptional({
    example: 45.5,
    description: 'Cost price for margin calculations',
  })
  @IsOptional()
  @IsNumber()
  cost_price?: number;

  @ApiProperty({
    type: [VariantAttributeValueDto],
    description:
      'Attribute value IDs that define this variant (color, size, material)',
    example: [
      { attribute_id: 1, attribute_value_id: 5 }, // color: red
      { attribute_id: 2, attribute_value_id: 8 }, // size: 42
      { attribute_id: 3, attribute_value_id: 12 }, // material: leather
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantAttributeValueDto)
  @ArrayMinSize(1)
  attribute_values: VariantAttributeValueDto[];

  @ApiPropertyOptional({
    example: { warehouse: 'NYC-01', priority: 'high' },
    description: 'Additional metadata',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  // 📦 INVENTORY
  @ApiPropertyOptional({ example: 100, description: 'Initial stock quantity' })
  @IsOptional()
  @IsNumber()
  initial_stock?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether to track inventory',
  })
  @IsOptional()
  @IsBoolean()
  track_quantity?: boolean;

  @ApiPropertyOptional({
    example: 10,
    description: 'Low stock alert threshold',
  })
  @IsOptional()
  @IsNumber()
  low_stock_threshold?: number;

  @ApiPropertyOptional({
    example: false,
    description: 'Allow backorders when out of stock',
  })
  @IsOptional()
  @IsBoolean()
  allow_backorders?: boolean;

  // 🚚 SHIPPING
  @ApiPropertyOptional({ example: 1.2, description: 'Weight in kg' })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ example: 30, description: 'Length in cm' })
  @IsOptional()
  @IsNumber()
  length?: number;

  @ApiPropertyOptional({ example: 20, description: 'Width in cm' })
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiPropertyOptional({ example: 10, description: 'Height in cm' })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Requires shipping (false for digital)',
  })
  @IsOptional()
  @IsBoolean()
  requires_shipping?: boolean;

  @ApiPropertyOptional({ example: 'standard', description: 'Shipping class' })
  @IsOptional()
  @IsString()
  shipping_class?: string;

  // 🖼️ MEDIA
  @ApiPropertyOptional({
    example: 'https://cdn.example.com/variant-1.jpg',
    description: 'Primary variant image',
  })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiPropertyOptional({
    type: [String],
    example: [
      'https://cdn.example.com/variant-1.jpg',
      'https://cdn.example.com/variant-2.jpg',
    ],
    description: 'Gallery image URLs',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery_images?: string[];
}
