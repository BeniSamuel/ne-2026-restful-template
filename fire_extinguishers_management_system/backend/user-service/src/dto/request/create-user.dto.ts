import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'firstName must not be empty!' })
  firstName: string;

  @IsNotEmpty({ message: 'lastName must not be empty!' })
  lastName: string;

  @IsNotEmpty({ message: 'email must not be empty!' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'password must not be empty!' })
  @MinLength(8)
  password: string;

}
