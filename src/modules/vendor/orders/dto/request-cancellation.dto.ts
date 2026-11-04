// src/modules/order/dto/request-cancellation.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RequestCancellationDto {
    @ApiProperty({
        example: 'Item arrived damaged',
        minLength: 3,
        maxLength: 500,
        description:
            'Reason for the cancellation request. Sent to the vendor for approval.',
    })
    @IsString()
    @MinLength(3)
    @MaxLength(500)
    reason: string;
}