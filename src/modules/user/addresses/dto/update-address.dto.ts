import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
    @ApiPropertyOptional({
        description: 'Address ID to update',
        example: 1,
        type: Number,
    })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    id?: number;
}
