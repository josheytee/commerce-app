// src/modules/order/dto/create-order-item-review.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsInt,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';

export class CreateOrderItemReviewDto {
    @ApiProperty({
        example: 5,
        minimum: 1,
        maximum: 5,
        description: 'Star rating from 1 to 5',
    })
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiPropertyOptional({
        example: 'Great quality',
        maxLength: 200,
        description: 'Short title shown above the review body',
    })
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(200)
    title?: string;

    @ApiPropertyOptional({
        example: 'Fits perfectly and shipped fast. Would buy again.',
        maxLength: 2000,
        description: 'Review body',
    })
    @IsOptional()
    @IsString()
    @MinLength(10)
    @MaxLength(2000)
    content?: string;
}