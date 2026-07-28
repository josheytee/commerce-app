// dto/vendor-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { VendorModel } from 'src/infrastructure';

export class VendorMetaDto {
    @ApiProperty({ description: 'Total number of vendors' })
    total: number;

    @ApiProperty({ description: 'Current page number' })
    page: number;

    @ApiProperty({ description: 'Number of items per page' })
    limit: number;

    @ApiProperty({ description: 'Total number of pages' })
    totalPages: number;

    @ApiProperty({ description: 'Has next page', required: false })
    hasNextPage?: boolean;

    @ApiProperty({ description: 'Has previous page', required: false })
    hasPrevPage?: boolean;
}

export class VendorListResponseDto {
    @ApiProperty({ description: 'List of vendors', type: [VendorModel] })
    data: VendorModel[];

    @ApiProperty({ description: 'Pagination metadata', type: VendorMetaDto })
    meta: VendorMetaDto;
}
