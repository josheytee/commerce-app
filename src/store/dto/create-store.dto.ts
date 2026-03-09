import { IsString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsInt()
  readonly address_id: number;

  @IsInt()
  readonly vendor_id: number;
}
