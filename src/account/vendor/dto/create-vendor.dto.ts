import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsInt()
  @IsNotEmpty()
  readonly userId: number; // The user who owns the vendor
}
