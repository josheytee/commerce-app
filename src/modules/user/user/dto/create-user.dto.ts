import { IsNotEmpty, MinLength, IsEmail, IsEnum } from 'class-validator';

// export class CreateUserDto {
//   firstName: string;
//   lastName: string;
// }

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export class CreateUserDto {
  @IsNotEmpty()
  readonly first_name: string;
  readonly last_name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @IsNotEmpty()
  @IsEnum(Gender, {
    message: 'gender must be either male or female',
  })
  readonly gender: Gender;
}
