import { IsString, IsOptional, IsNumber } from 'class-validator';
import { CreateProductWithVariantsDto } from './create-product-with-variants.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(
  CreateProductWithVariantsDto,
) {
}
