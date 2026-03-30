import { PartialType } from '@nestjs/mapped-types';
import { CreateProductAttributeDto } from './create_product_attribute.dto';

export class UpdateProductAttributeDto extends PartialType(
  CreateProductAttributeDto,
) {}
