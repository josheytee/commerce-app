import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  IsBoolean,
  IsObject,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { VendorStatusEnum } from 'src/shared';

export class CreateVendorDto {
  @ApiProperty({
    example: 'Tech World',
    description: 'Name of the business',
  })
  @IsString()
  business_name: string;

  @ApiProperty({
    example: '+2348012345678',
    description: 'Business phone number',
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  business_phone: string;

  @ApiPropertyOptional({
    example: 'contact@techworld.com',
  })
  @IsEmail()
  @IsOptional()
  business_email?: string;

  @ApiPropertyOptional({
    example: 'We sell gadgets and electronics',
  })
  @IsString()
  @IsOptional()
  business_description?: string;

  @ApiPropertyOptional({
    example: 'Top gadgets store',
  })
  @IsString()
  @IsOptional()
  business_short_description?: string;

  @ApiPropertyOptional({
    example: '12 Allen Avenue, Lagos',
  })
  @IsString()
  @IsOptional()
  business_address?: string;

  @ApiPropertyOptional({
    example: 'https://techworld.com',
  })
  @IsString()
  @IsOptional()
  business_website?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.com/logo.png',
  })
  @IsString()
  @IsOptional()
  logo_url?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.com/banner.png',
  })
  @IsString()
  @IsOptional()
  cover_image_url?: string;

  @ApiPropertyOptional({
    example: 4.5,
    minimum: 0,
    maximum: 5,
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating_average?: number;

  @ApiPropertyOptional({ example: 120 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  total_ratings?: number;

  @ApiPropertyOptional({ example: 45 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  total_reviews?: number;

  @ApiPropertyOptional({
    example: { monday: '9am - 5pm' },
    description: 'Business operating hours',
  })
  @IsObject()
  @IsOptional()
  business_hours?: Record<string, any>;

  @ApiPropertyOptional({
    example: { instagram: '@techworld' },
  })
  @IsObject()
  @IsOptional()
  social_media?: Record<string, any>;

  @ApiPropertyOptional({
    example: ['repair', 'delivery'],
  })
  @IsArray()
  @IsOptional()
  business_services?: string[];

  @ApiPropertyOptional({
    example: ['card', 'transfer'],
  })
  @IsArray()
  @IsOptional()
  payment_methods?: string[];

  @ApiPropertyOptional({
    example: ['pickup', 'delivery'],
  })
  @IsArray()
  @IsOptional()
  delivery_options?: string[];

  @ApiPropertyOptional({
    enum: VendorStatusEnum,
    example: VendorStatusEnum.PENDING,
  })
  @IsEnum(VendorStatusEnum)
  @IsOptional()
  status?: VendorStatusEnum;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  is_verified?: boolean;

  @ApiPropertyOptional({ example: 'TIN123456' })
  @IsString()
  @IsOptional()
  tax_id?: string;

  @ApiPropertyOptional({ example: 'RC123456' })
  @IsString()
  @IsOptional()
  registration_number?: string;

  // @ApiPropertyOptional({
  //   example: { theme: 'dark' },
  // })
  // @IsObject()
  // @IsOptional()
  // settings?: Record<string, any>;

  // @ApiPropertyOptional({
  //   example: { source: 'mobile_app' },
  // })
  // @IsObject()
  // @IsOptional()
  // metadata?: Record<string, any>;

  @ApiProperty({
    example: 1,
    description: 'User ID linked to this vendor',
  })
  @IsNumber()
  @ApiHideProperty()
  user_id: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'CategoryModel ID',
  })
  @IsNumber()
  @IsOptional()
  category_id?: number;
}
