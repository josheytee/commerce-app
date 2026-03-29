// create-vendor.dto.ts
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
  min,
} from 'class-validator';

export class CreateVendorDto {
  @IsString()
  business_name: string;

  @IsString()
  @Max(20)
  business_phone: string;

  @IsEmail()
  @IsOptional()
  business_email?: string;

  @IsString()
  @IsOptional()
  business_description?: string;

  @IsString()
  @IsOptional()
  business_short_description?: string;

  @IsString()
  @IsOptional()
  business_address?: string;

  @IsString()
  @IsOptional()
  business_website?: string;

  @IsString()
  @IsOptional()
  logo_url?: string;

  @IsString()
  @IsOptional()
  cover_image_url?: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating_average?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  total_ratings?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  total_reviews?: number;

  @IsObject()
  @IsOptional()
  business_hours?: Record<string, any>;

  @IsObject()
  @IsOptional()
  social_media?: Record<string, any>;

  @IsArray()
  @IsOptional()
  business_services?: string[];

  @IsArray()
  @IsOptional()
  payment_methods?: string[];

  @IsArray()
  @IsOptional()
  delivery_options?: string[];

  @IsEnum(['pending', 'active', 'suspended', 'inactive'])
  @IsOptional()
  status?: string;

  @IsBoolean()
  @IsOptional()
  is_verified?: boolean;

  @IsString()
  @IsOptional()
  tax_id?: string;

  @IsString()
  @IsOptional()
  registration_number?: string;

  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsNumber()
  user_id: number;

  @IsNumber()
  @IsOptional()
  category_id?: number;
}
