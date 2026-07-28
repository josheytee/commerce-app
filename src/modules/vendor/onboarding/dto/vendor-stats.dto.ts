// dto/vendor-stats.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class VendorStatsDto {
    @ApiProperty({ description: 'Total number of orders' })
    totalOrders: number;

    @ApiProperty({ description: 'Total revenue' })
    totalRevenue: number;

    @ApiProperty({ description: 'Average rating' })
    averageRating: number;

    @ApiProperty({ description: 'Total number of products' })
    totalProducts: number;

    @ApiProperty({ description: 'Total number of stores' })
    totalStores: number;

    @ApiProperty({ description: 'Total number of reviews', required: false })
    totalReviews?: number;

    @ApiProperty({ description: 'Completion rate', required: false })
    completionRate?: number;

    @ApiProperty({ description: 'Response time in hours', required: false })
    avgResponseTime?: number;
}