import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsArray,
    IsBoolean,
    MaxLength,
    Min,
    Max,
    ArrayMaxSize,
    ArrayMinSize,
    ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ReviewType } from '../model/review-type.enum';

export class CreateReviewDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    // This is the actual database entity/model name
    @IsEnum(ReviewType)
    @IsNotEmpty()
    entity_type: ReviewType;

    @IsInt()
    @IsNotEmpty()
    entity_id: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayMaxSize(20)
    pros?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayMaxSize(20)
    cons?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayMaxSize(10)
    images?: string[];

    @IsOptional()
    @IsBoolean()
    is_verified_purchase?: boolean;

    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        }
        return value;
    })
    metadata?: Record<string, any>;

    // Optional rating that can be submitted with the review
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;
}
