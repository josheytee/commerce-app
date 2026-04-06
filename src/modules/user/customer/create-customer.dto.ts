import { IsNotEmpty, MinLength, IsEmail, IsEnum, IsString, IsOptional } from 'class-validator';

export class CreateCustomerDto {

    @IsNotEmpty()
    @IsEmail()
    user_id: string;

    @IsNotEmpty()
    @MinLength(6)
    default_address_id: string;

    @IsString()
    @IsOptional()
    status: string;
}
