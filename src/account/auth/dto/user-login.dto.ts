import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserLoginDto {
    @IsEmail()
    email: string;

    @IsString()
    usernamr: string;

    @IsString()
    @MinLength(6)
    password: string;
}
