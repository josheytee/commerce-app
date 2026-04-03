import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
  IsBoolean,
} from 'class-validator';

export class CreateVariantDto {
  @ApiProperty({ example: 'NIKE-AM-42-BLK' })
  @IsString()
  sku: string;

  @ApiPropertyOptional({ example: '1234567890123' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({ example: 'Black / Size 42' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 120000 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({
    example: { color: 'black', size: '42' },
  })
  @IsOptional()
  @IsObject()
  attributes?: Record<string, string>;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  initial_stock?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  track_quantity?: boolean;

  // 🚚 SHIPPING
  @ApiPropertyOptional({ example: 1.2 })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  length?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  height?: number;
}
