import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from './product-response.dto';

class FlashDealDto extends ProductResponseDto {
    @ApiProperty()
    flash_deal_ends_at?: Date;

    @ApiProperty()
    discount: number;
}

export class IndexPageResponseDto {
    @ApiProperty({ type: [FlashDealDto] })
    flashDeals: FlashDealDto[];

    @ApiProperty({ type: [ProductResponseDto] })
    bestSellers: ProductResponseDto[];

    @ApiProperty({ type: [ProductResponseDto] })
    mostPopular: ProductResponseDto[];

    @ApiProperty({ type: [ProductResponseDto] })
    topRated: ProductResponseDto[];

    @ApiProperty({ type: [ProductResponseDto] })
    newArrivals: ProductResponseDto[];

    @ApiProperty({ type: [ProductResponseDto] })
    featuredProducts: ProductResponseDto[];
}