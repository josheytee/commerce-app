import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Min,
    Max,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRatingDto {
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    rating: number;

    @IsOptional()
    @IsString()
    comment?: string;

    @IsString()
    @IsNotEmpty()
    entity_type: string;

    @IsInt()
    @IsNotEmpty()
    entity_id: number;

    @IsOptional()
    @ValidateNested()
    @Type(() => Object)
    criteria_scores?: Record<string, number>;

    @IsOptional()
    metadata?: Record<string, any>;
}
