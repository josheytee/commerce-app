
// src/modules/order/dto/order-item-input.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class OrderItemInputDto {
  @ApiProperty({ example: 42, description: 'Product variant ID' })
  @IsInt()
  variant_id: number;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 1, description: 'Store ID the variant is listed in' })
  @IsInt()
  store_id: number;

  @ApiProperty({ example: 1, description: 'Vendor ID that owns the variant' })
  @IsInt()
  vendor_id: number;

  @ApiPropertyOptional({
    example: 'Gift wrap requested',
    description: 'Per-item note passed through to the order item',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
