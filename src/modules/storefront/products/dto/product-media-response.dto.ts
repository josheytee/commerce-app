// src/modules/storefront/products/dto/product-media-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ProductMediaResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'https://cdn.example.com/products/hero.jpg' })
    url: string;

    @ApiProperty({ example: 'product_image' })
    type: string;

    @ApiProperty({ example: true })
    is_primary: boolean;

    @ApiProperty({ example: 0 })
    sort_order: number;
}
