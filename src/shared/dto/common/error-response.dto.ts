// shared/dto/common/error-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ValidationErrorDto {
    @ApiProperty({ example: 'email', description: 'Field with error' })
    field: string;

    @ApiProperty({ example: 'Invalid email format', description: 'Error message' })
    message: string;

    @ApiPropertyOptional({ example: 'invalid_format', description: 'Error code' })
    code?: string;

    @ApiPropertyOptional({ example: 'user@example', description: 'Rejected value' })
    rejectedValue?: any;
}

export class ErrorMetaDto {
    @ApiPropertyOptional({ example: 'AUTH_1001', description: 'Application error code' })
    errorCode?: string;

    @ApiPropertyOptional({ example: '2024-01-20T10:30:00Z', description: 'Timestamp' })
    timestamp?: string;

    @ApiPropertyOptional({ example: 'req_123456', description: 'Request ID for tracing' })
    requestId?: string;

    @ApiPropertyOptional({ example: '/api/v1/auth/login', description: 'Request path' })
    path?: string;

    @ApiPropertyOptional({ type: [ValidationErrorDto], description: 'Validation errors' })
    errors?: ValidationErrorDto[];

    @ApiPropertyOptional({ description: 'Additional debug info (dev only)' })
    stack?: string;
}

export class ErrorResponseDto {
    @ApiProperty({ example: false })
    success: boolean;

    @ApiProperty({ example: 'Authentication failed', description: 'Error message' })
    message: string;

    @ApiProperty({ example: null })
    data: null;

    @ApiPropertyOptional({ type: ErrorMetaDto })
    meta?: ErrorMetaDto;
}