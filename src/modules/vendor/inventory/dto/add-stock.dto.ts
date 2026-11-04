// src/modules/inventory/dto/add-stock.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsObject, IsOptional, Min } from 'class-validator';

export class AddStockDto {
    @ApiProperty({ example: 50, minimum: 1 })
    @IsInt()
    @Min(1)
    quantity: number;

    @ApiPropertyOptional({
        example: { reference: 'PO-2025-0001', supplier: 'Acme' },
    })
    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}