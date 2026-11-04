// src/modules/order/dto/add-shipment-event.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class AddShipmentEventDto {
    @ApiProperty({
        example: 'in_transit',
        maxLength: 50,
        description:
            'Event status. Common values: picked_up, in_transit, out_for_delivery, delivered, exception.',
    })
    @IsString()
    @MaxLength(50)
    status: string;

    @ApiProperty({
        example: 'Lagos Sorting Hub',
        maxLength: 255,
        description: 'Where the event occurred',
    })
    @IsString()
    @MaxLength(255)
    location: string;

    @ApiProperty({
        example: 'Package departed sorting facility',
        maxLength: 500,
        description: 'Human-readable description of the event',
    })
    @IsString()
    @MaxLength(500)
    description: string;

    @ApiPropertyOptional({
        description: 'Raw provider payload, stored for auditing',
        example: { code: 'DPT', facility_id: 'LAG-01' },
    })
    @IsOptional()
    @IsObject()
    raw_payload?: Record<string, any>;
}
