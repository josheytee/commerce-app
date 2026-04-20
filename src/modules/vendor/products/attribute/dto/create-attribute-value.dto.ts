// dto/attribute-value/create-attribute-value.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAttributeValueDto {
  @ApiProperty({
    description: 'ID of the attribute this value belongs to',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  attribute_id: number;

  @ApiProperty({
    description: 'Attribute value (e.g., "Red")',
    example: 'Red',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  value: string;

  @ApiPropertyOptional({
    description: 'Display value (pretty name)',
    example: 'Crimson Red',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  display_value?: string;

  @ApiPropertyOptional({
    description: 'Hex color code for color attributes',
    example: '#FF0000',
    maxLength: 7,
  })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  color_code?: string;

  @ApiPropertyOptional({
    description: 'Sort order for display',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sort_order?: number;

  @ApiPropertyOptional({
    description: 'URL to swatch image',
    example: 'https://example.com/images/red-swatch.jpg',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  image_url?: string;
}
