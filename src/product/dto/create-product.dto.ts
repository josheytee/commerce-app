import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Attribute } from 'src/attribute/models/attribute.model';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsNumber()
  @IsNotEmpty()
  store_id: number;

  // attributes: Attribute[];
}
