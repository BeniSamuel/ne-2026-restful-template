import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, Min } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  hotelId: number;

  @ApiProperty({ example: '2026-06-01T10:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  checkInDate: Date;

  @ApiProperty({ example: '2026-06-03T10:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  checkOutDate: Date;
}
