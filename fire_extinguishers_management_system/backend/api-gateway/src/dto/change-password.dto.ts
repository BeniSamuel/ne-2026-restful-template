import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'admin@tzw.test',
    description: 'Email address of the account changing its password',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Admin123!',
    description: 'Current password',
  })
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    example: 'NewAdmin123!',
    minLength: 8,
    description: 'New password',
  })
  @MinLength(8)
  newPassword: string;
}
