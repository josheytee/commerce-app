import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    IsArray,
    IsBoolean,
    MaxLength,
    Min,
    Max,
    ArrayMaxSize,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { ReviewTypeEnum } from 'src/shared';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    title?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsEnum(ReviewTypeEnum)
    entity_type?: ReviewTypeEnum;

    @IsOptional()
    @IsInt()
    entity_id?: number;

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
    @IsBoolean()
    is_approved?: boolean;

    @IsOptional()
    metadata?: Record<string, any>;
}
