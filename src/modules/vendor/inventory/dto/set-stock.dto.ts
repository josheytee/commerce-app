// src/modules/inventory/dto/set-stock.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class SetStockDto {
    @ApiProperty({ example: 75, minimum: 0 })
    @IsInt()
    @Min(0)
    quantity: number;
}
