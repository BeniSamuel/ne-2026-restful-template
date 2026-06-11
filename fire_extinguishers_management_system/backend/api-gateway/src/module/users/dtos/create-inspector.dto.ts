import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateInspectorDto {
  @ApiProperty({ example: 'Field' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Inspector' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'new.inspector@tzw.test' })
  @IsEmail()
  email: string;
}
