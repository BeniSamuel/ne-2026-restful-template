import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class UpdateBookingDto {
  @ApiProperty({ example: '2026-06-02T10:00:00.000Z', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  checkInDate?: Date;

  @ApiProperty({ example: '2026-06-04T10:00:00.000Z', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  checkOutDate?: Date;
}
