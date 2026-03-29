import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserLoginDto {
    @ApiProperty({
        example: 'ade@ola.com',
        description: 'User email address',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '123456',
        description: 'User password (minimum 6 characters)',
        minLength: 6,
    })
    @IsString()
    @MinLength(6)
    password: string;
}