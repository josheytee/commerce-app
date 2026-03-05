import { IsString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsInt()
  @IsOptional()
  readonly user_id?: number;

  @IsString()
  @IsNotEmpty()
  readonly business_name: string;

  @IsString()
  @IsNotEmpty()
  readonly business_phone: string;
}
