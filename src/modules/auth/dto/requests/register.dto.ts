import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsString,
    MinLength,
    IsOptional,
    IsIn,
} from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'adeoa' })
    @IsString()
    username: string;

    @ApiProperty({ example: 'ade' })
    @IsString()
    first_name: string;

    @ApiProperty({ example: 'ola' })
    @IsString()
    last_name: string;

    @ApiProperty({ example: 'ade@ola.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456', minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'female', required: false })
    @IsOptional()
    @IsString()
    @IsIn(['male', 'female'])
    gender?: string;

    @ApiProperty({ example: '32274', required: false })
    @IsOptional()
    @IsString()
    phone_number?: string;
}