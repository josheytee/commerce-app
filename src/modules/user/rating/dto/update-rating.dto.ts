import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { CreateRatingDto } from './create-rating.dto';

export class UpdateRatingDto extends PartialType(CreateRatingDto) {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;

    @IsOptional()
    comment?: string;
}
