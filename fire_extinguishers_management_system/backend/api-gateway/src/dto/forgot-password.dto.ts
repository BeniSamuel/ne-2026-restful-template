import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'admin@tzw.test',
    description: 'Email address that should receive password reset instructions',
  })
  @IsEmail()
  email: string;
}
