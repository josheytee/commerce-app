export * from './create-product.dto';
export * from './update-product.dto';
export * from './product-response.dto';
export * from './index-page-response.dto';
export * from './product-query.dto';
export * from './product-params.dto';


import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  itemsPerPage: number;
}

export class PaginatedResponseDto<T> {
  items: T[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}