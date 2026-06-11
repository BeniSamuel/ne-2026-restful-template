import { IsNotEmpty, MinLength } from 'class-validator';

export class SetupPasswordDto {
  @IsNotEmpty()
  tokenHash: string;

  @MinLength(8)
  password: string;
}
