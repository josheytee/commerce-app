import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsOptional,
    IsInt,
    IsEnum,
    IsBoolean,
    Min,
    Max,
    IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressableTypeEnum, AddressTypeEnum } from 'src/shared/enums';

export class AddressQueryDto {
    @ApiPropertyOptional({
        description: 'Filter by addressable ID',
        example: 123,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    addressable_id?: number;

    @ApiPropertyOptional({
        description: 'Filter by addressable type',
        enum: AddressableTypeEnum,
    })
    @IsOptional()
    @IsEnum(AddressableTypeEnum)
    addressable_type?: AddressableTypeEnum;

    @ApiPropertyOptional({
        description: 'Filter by address type',
        enum: AddressTypeEnum,
    })
    @IsOptional()
    @IsEnum(AddressTypeEnum)
    address_type?: AddressTypeEnum;

    @ApiPropertyOptional({
        description: 'Filter by city ID',
        example: 45,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    city_id?: number;

    @ApiPropertyOptional({
        description: 'Filter by state ID',
        example: 12,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    state_id?: number;

    @ApiPropertyOptional({
        description: 'Filter by country ID',
        example: 164,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    country_id?: number;

    @ApiPropertyOptional({
        description: 'Filter by default address',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    is_default?: boolean;

    @ApiPropertyOptional({
        description: 'Filter by verified status',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    is_verified?: boolean;

    @ApiPropertyOptional({
        description: 'Search by address text',
        example: 'Allen Avenue',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Page number for pagination',
        example: 1,
        default: 1,
        minimum: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Items per page',
        example: 10,
        default: 10,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit?: number = 10;

    @ApiPropertyOptional({
        description: 'Sort field',
        example: 'created_at',
        enum: ['created_at', 'updated_at', 'address_line1', 'city_id', 'state_id'],
    })
    @IsOptional()
    @IsString()
    sort_by?: string = 'created_at';

    @ApiPropertyOptional({
        description: 'Sort order',
        enum: ['ASC', 'DESC'],
        default: 'DESC',
    })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    sort_order?: 'ASC' | 'DESC' = 'DESC';
}
