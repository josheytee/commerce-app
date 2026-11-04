// src/modules/vendor/products/formats/dto/product-media-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductMediaResponseDto {
    @ApiProperty({ example: 1, description: 'Media record id' })
    id: number;

    @ApiProperty({
        example: 'https://cdn.example.com/products/red-front.jpg',
        description: 'Public URL of the media file',
    })
    url: string;

    @ApiProperty({
        example: 'product_image',
        description: 'Media type (see MediaTypeEnum)',
    })
    type: string;

    @ApiProperty({
        example: true,
        description: 'Whether this is the primary/featured image',
    })
    is_primary: boolean;

    @ApiProperty({ example: 0, description: 'Display order (ascending)' })
    sort_order: number;
}