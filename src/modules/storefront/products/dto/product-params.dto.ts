// dto/product-params.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProductIncludeQueryDto {
    @ApiPropertyOptional({
        description: 'Comma-separated list of relations to include',
        example: 'variants,reviews,gallery,vendor,store',
        type: String,
    })
    @IsOptional()
    @IsString()
    include?: string;
}