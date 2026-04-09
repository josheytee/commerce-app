import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AddressableTypeEnum, AddressTypeEnum } from 'src/shared/enums';

export class AddressResponseDto {
    @ApiProperty({
        description: 'Unique address ID',
        example: 1,
        type: Number,
    })
    id: number;

    @ApiProperty({
        description: 'ID of the entity this address belongs to',
        example: 123,
        type: Number,
    })
    addressable_id: number;

    @ApiProperty({
        description: 'Type of entity this address belongs to',
        enum: AddressableTypeEnum,
        example: AddressableTypeEnum.CUSTOMER,
    })
    addressable_type: AddressableTypeEnum;

    @ApiProperty({
        description: 'Type of address',
        enum: AddressTypeEnum,
        example: AddressTypeEnum.BOTH,
    })
    address_type: AddressTypeEnum;

    @ApiPropertyOptional({
        description: 'Address label',
        example: 'Main Office',
    })
    label?: string;

    @ApiPropertyOptional({
        description: 'Contact person name',
        example: 'John Doe',
    })
    contact_name?: string;

    @ApiPropertyOptional({
        description: 'Contact phone number',
        example: '+2348012345678',
    })
    contact_phone?: string;

    @ApiProperty({
        description: 'First line of address',
        example: '123 Allen Avenue',
    })
    address_line1: string;

    @ApiPropertyOptional({
        description: 'Second line of address',
        example: 'Suite 456',
    })
    address_line2?: string;

    @ApiPropertyOptional({
        description: 'Landmark',
        example: 'Opposite Shoprite Mall',
    })
    landmark?: string;

    @ApiProperty({
        description: 'City ID',
        example: 45,
    })
    city_id: number;

    @ApiPropertyOptional({
        description: 'City name',
        example: 'Ikeja',
    })
    city_name?: string;

    @ApiProperty({
        description: 'State ID',
        example: 12,
    })
    state_id: number;

    @ApiPropertyOptional({
        description: 'State name',
        example: 'Lagos',
    })
    state_name?: string;

    @ApiProperty({
        description: 'Country ID',
        example: 164,
    })
    country_id: number;

    @ApiPropertyOptional({
        description: 'Country name',
        example: 'Nigeria',
    })
    country_name?: string;

    @ApiPropertyOptional({
        description: 'Postal/ZIP code',
        example: '100001',
    })
    postal_code?: string;

    @ApiPropertyOptional({
        description: 'PO Box',
        example: 'PO Box 123',
    })
    po_box?: string;

    @ApiProperty({
        description: 'Is this the default address',
        example: false,
    })
    is_default: boolean;

    @ApiProperty({
        description: 'Is this the primary store address',
        example: false,
    })
    is_primary_store: boolean;

    @ApiProperty({
        description: 'Is address verified',
        example: false,
    })
    is_verified: boolean;

    @ApiPropertyOptional({
        description: 'Delivery instructions',
        example: 'Call before delivery',
    })
    delivery_instructions?: string;

    @ApiPropertyOptional({
        description: 'Full formatted address',
        example: '123 Allen Avenue, Ikeja, Lagos, Nigeria, 100001',
    })
    full_address?: string;

    @ApiPropertyOptional({
        description: 'Short formatted address',
        example: '123 Allen Avenue, Ikeja, Lagos',
    })
    short_address?: string;

    @ApiPropertyOptional({
        description: 'Latitude coordinate',
        example: 6.6018,
    })
    latitude?: number;

    @ApiPropertyOptional({
        description: 'Longitude coordinate',
        example: 3.3515,
    })
    longitude?: number;

    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-01-01T00:00:00.000Z',
    })
    created_at: Date;

    @ApiProperty({
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00.000Z',
    })
    updated_at: Date;
}
