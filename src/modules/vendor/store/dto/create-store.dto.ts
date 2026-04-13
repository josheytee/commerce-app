import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { StoreStatusEnum } from 'src/shared';

export class CreateStoreDto {
  @ApiProperty({ example: 'Tech World Store' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Best gadgets and electronics store',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: null,
    description: 'Address ID',
  })
  @IsNumber()
  address_id: number;

  @ApiHideProperty()
  @IsNumber()
  vendor_id: number;

  // 🔥 NEW FIELDS

  @ApiProperty({
    example: 'tech-world-store',
    description: 'Unique store slug (URL friendly)',
  })
  @IsString()
  @IsOptional()
  @ApiHideProperty()
  slug?: string;

  @ApiPropertyOptional({
    example: 'Best Tech Store in Nigeria',
  })
  @IsString()
  @IsOptional()
  meta_title?: string;

  @ApiPropertyOptional({
    example: 'Shop the best gadgets and electronics',
  })
  @IsString()
  @IsOptional()
  meta_description?: string;

  @ApiPropertyOptional({
    example: ['electronics', 'gadgets'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    enum: StoreStatusEnum,
    example: StoreStatusEnum.INACTIVE,
    description: 'Store status (default is inactive)',
  })
  @IsEnum(StoreStatusEnum)
  @IsOptional()
  status?: StoreStatusEnum;

  @ApiPropertyOptional({
    example: false,
    description: 'Is store verified by admin',
  })
  @IsBoolean()
  @IsOptional()
  is_verified?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Is store featured on platform',
  })
  @IsBoolean()
  @IsOptional()
  is_featured?: boolean;
}
