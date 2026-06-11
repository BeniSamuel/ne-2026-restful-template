import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'Beni',
    description: 'User first name',
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Samuel',
    description: 'User last name',
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'benisamuel566@gmail.com',
    description: 'Unique email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'beni@ish',
    minLength: 8,
    description: 'Password with at least 8 characters',
  })
  @MinLength(8)
  password: string;
}
