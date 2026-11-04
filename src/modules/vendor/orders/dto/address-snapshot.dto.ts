// src/modules/order/dto/address-snapshot.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddressSnapshot {
    @ApiProperty() name: string;
    @ApiProperty() street: string;
    @ApiProperty() city: string;
    @ApiProperty() state: string;
    @ApiProperty() postal_code: string;
    @ApiProperty() country: string;
    @ApiPropertyOptional() phone?: string;
    @ApiPropertyOptional() lat?: number;
    @ApiPropertyOptional() lng?: number;
}