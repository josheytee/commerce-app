import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  Matches,
} from 'class-validator';
import { ProductStatusEnum, ProductTypeEnum } from 'src/shared';

export class CreateProductDto {
  // 🧱 BASIC
  @ApiProperty({ example: 'Nike Air Max' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'nike-air-max' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ example: 'Premium running shoes' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Short summary' })
  @IsOptional()
  @IsString()
  short_description?: string;

  @ApiPropertyOptional({ example: 'Full product details' })
  @IsOptional()
  @IsString()
  details?: string;

  // 🆔 IDENTIFIERS
  @ApiPropertyOptional({ example: '123456789012' })
  @IsOptional()
  @Matches(/^\d{12}$/, { message: 'UPC must be 12 digits' })
  upc?: string;

  @ApiPropertyOptional({ example: '1234567890123' })
  @IsOptional()
  @Matches(/^\d{13}$/, { message: 'EAN must be 13 digits' })
  ean?: string;

  @ApiPropertyOptional({ example: '9783161484100' })
  @IsOptional()
  @Matches(/^(?:\d{10}|\d{13})$/, {
    message: 'ISBN must be 10 or 13 digits',
  })
  isbn?: string;

  @ApiPropertyOptional({ example: 'A2890' })
  @IsOptional()
  @IsString()
  mpn?: string;

  // 💰 PRICING (BASE PRICE ONLY)
  @ApiProperty({ example: 120000 })
  @IsNumber()
  base_price: number;

  @ApiPropertyOptional({ example: 150000 })
  @IsOptional()
  @IsNumber()
  compare_at_price?: number;

  @ApiPropertyOptional({ example: 80000 })
  @IsOptional()
  @IsNumber()
  cost_price?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  requires_shipping?: boolean;

  // 🏷️ META
  @ApiPropertyOptional({ example: 'Nike Air Max Shoes' })
  @IsOptional()
  @IsString()
  meta_title?: string;

  @ApiPropertyOptional({ example: 'Best running shoes' })
  @IsOptional()
  @IsString()
  meta_description?: string;

  @ApiPropertyOptional({ example: 'nike, shoes, running' })
  @IsOptional()
  @IsString()
  meta_keywords?: string;

  // ⚙️ STATUS
  @ApiPropertyOptional({ enum: ProductStatusEnum })
  @IsOptional()
  @IsEnum(ProductStatusEnum)
  status?: ProductStatusEnum;

  @ApiPropertyOptional({ enum: ProductTypeEnum })
  @IsOptional()
  @IsEnum(ProductTypeEnum)
  product_type?: ProductTypeEnum;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  // 🔗 RELATIONS
  @ApiProperty({ example: 1 })
  @IsNumber()
  store_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @ApiHideProperty()
  vendor_id?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  section_id?: number;
}
