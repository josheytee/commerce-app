import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StoreResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Tech World Store' })
  name: string;

  @ApiPropertyOptional({
    example: 'Best gadgets and electronics store',
  })
  description?: string;

  @ApiProperty({ example: 1 })
  address_id: number;

  @ApiProperty({ example: 5 })
  vendor_id: number;

  @ApiProperty({ example: '2026-03-31T10:00:00.000Z' })
  created_at: string;

  @ApiProperty({ example: '2026-03-31T10:00:00.000Z' })
  updated_at: string;
}