import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsInt,
    IsString,
    IsOptional,
    IsBoolean,
    IsNumber,
    IsEnum,
    Min,
    Max,
    IsPositive,
    Length,
    Matches,
    MinLength,
    MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressableTypeEnum, AddressTypeEnum } from 'src/shared/enums';

export class CreateAddressDto {
    @ApiProperty({
        description:
            'ID of the entity this address belongs to (customer, store, etc.)',
        example: 123,
        type: Number,
        minimum: 1,
    })
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    addressable_id: number;

    @ApiProperty({
        description: 'Type of entity this address belongs to',
        enum: AddressableTypeEnum,
        example: AddressableTypeEnum.CUSTOMER,
        enumName: 'AddressableTypeEnum',
    })
    @IsEnum(AddressableTypeEnum)
    addressable_type: AddressableTypeEnum;

    @ApiProperty({
        description: 'Type of address (billing, shipping, etc.)',
        enum: AddressTypeEnum,
        example: AddressTypeEnum.BOTH,
        enumName: 'AddressTypeEnum',
        default: AddressTypeEnum.BOTH,
    })
    @IsEnum(AddressTypeEnum)
    address_type: AddressTypeEnum;

    @ApiPropertyOptional({
        description: 'Label for the address (e.g., Home, Office, Warehouse)',
        example: 'Main Office',
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    label?: string;

    @ApiPropertyOptional({
        description: 'Name of the contact person at this address',
        example: 'John Doe',
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    contact_name?: string;

    @ApiPropertyOptional({
        description: 'Phone number of the contact person',
        example: '+2348012345678',
        pattern: '^[+]?[0-9]{10,15}$',
    })
    @IsOptional()
    @IsString()
    @Matches(/^[+]?[0-9]{10,15}$/, {
        message: 'Phone number must be 10-15 digits, optionally starting with +',
    })
    contact_phone?: string;

    @ApiProperty({
        description: 'First line of the address',
        example: '123 Allen Avenue',
        required: true,
        maxLength: 255,
    })
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    address_line1: string;

    @ApiPropertyOptional({
        description: 'Second line of the address',
        example: 'Suite 456',
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    address_line2?: string;

    @ApiPropertyOptional({
        description: 'Landmark near the address',
        example: 'Opposite Shoprite Mall',
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    landmark?: string;

    @ApiProperty({
        description: 'ID of the city',
        example: 45,
        type: Number,
        minimum: 1,
    })
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    city_id: number;

    @ApiProperty({
        description: 'ID of the state/province',
        example: 12,
        type: Number,
        minimum: 1,
    })
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    state_id: number;

    @ApiProperty({
        description: 'ID of the country',
        example: 164,
        type: Number,
        minimum: 1,
    })
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    country_id: number;

    @ApiPropertyOptional({
        description: 'Postal/ZIP code',
        example: '100001',
        maxLength: 20,
        pattern: '^[A-Z0-9\\s-]+$',
    })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    @Matches(/^[A-Z0-9\s-]+$/i, {
        message:
            'Postal code can only contain letters, numbers, spaces, and hyphens',
    })
    postal_code?: string;

    @ApiPropertyOptional({
        description: 'Set as default address for this entity',
        example: false,
        default: false,
        type: Boolean,
    })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    is_default?: boolean;

    @ApiPropertyOptional({
        description: 'Latitude coordinate',
        example: 6.6018,
        minimum: -90,
        maximum: 90,
        type: Number,
    })
    @IsOptional()
    @IsNumber()
    @Min(-90)
    @Max(90)
    @Type(() => Number)
    latitude?: number;

    @ApiPropertyOptional({
        description: 'Longitude coordinate',
        example: 3.3515,
        minimum: -180,
        maximum: 180,
        type: Number,
    })
    @IsOptional()
    @IsNumber()
    @Min(-180)
    @Max(180)
    @Type(() => Number)
    longitude?: number;
}
