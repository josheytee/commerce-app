import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Min,
} from 'class-validator';
import { MediaTypeEnum } from 'src/shared';

export class CreateMediaDto {
    @IsUrl()
    @IsNotEmpty()
    url: string;

    @IsOptional()
    @IsString()
    key?: string;

    @IsOptional()
    @IsUrl()
    thumbnail_url?: string;

    @IsOptional()
    @IsUrl()
    medium_url?: string;

    @IsOptional()
    @IsString()
    alt_text?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    caption?: string;

    @IsEnum(MediaTypeEnum)
    @IsOptional()
    type: MediaTypeEnum;

    @IsString()
    @IsNotEmpty()
    entity_type: string;

    @IsInt()
    @IsNotEmpty()
    entity_id: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    sort_order?: number;

    @IsOptional()
    is_primary?: boolean;

    @IsOptional()
    metadata?: Record<string, any>;

    @IsOptional()
    @IsInt()
    file_size?: number;

    @IsOptional()
    @IsString()
    mime_type?: string;
}
