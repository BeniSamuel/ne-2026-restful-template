import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class SetupPasswordDto {
  @ApiProperty({
    example: 'paste-invitation-token-here',
    description: 'Inspector password setup token from invitation email',
  })
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: 'Inspector123!',
    minLength: 8,
  })
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'Inspector123!',
    minLength: 8,
  })
  @MinLength(8)
  confirmPassword: string;
}
