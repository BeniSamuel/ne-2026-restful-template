import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateInspectorDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  setupTokenHash: string;

  @IsNotEmpty()
  setupTokenExpiresAt: string;

  @IsNotEmpty()
  temporaryPassword: string;
}
