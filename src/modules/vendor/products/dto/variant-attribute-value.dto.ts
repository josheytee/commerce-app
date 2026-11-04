// src/modules/vendor/products/dto/variant-attribute-value.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class VariantAttributeValueDto {
    @ApiProperty({ example: 1, description: 'Attribute id (platform or vendor)' })
    @IsInt()
    attribute_id: number;

    @ApiProperty({ example: 5, description: 'Attribute value id' })
    @IsInt()
    attribute_value_id: number;
}