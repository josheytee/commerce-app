import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    IsBoolean,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReviewType } from '../model/review-type.enum';

export class ReviewQueryDto {
    @IsOptional()
    @IsString()
    entity_type?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    entity_id?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    user_id?: number;

    @IsOptional()
    @IsEnum(ReviewType)
    type?: ReviewType;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    is_approved?: boolean;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    is_verified_purchase?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 20;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    offset?: number = 0;

    @IsOptional()
    @IsString()
    sort?: string = 'created_at';

    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    order?: 'ASC' | 'DESC' = 'DESC';
}
