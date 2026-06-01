import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({ example: '2026-06-01T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  periodStart: Date;

  @ApiProperty({ example: '2026-06-30T23:59:59.000Z' })
  @Type(() => Date)
  @IsDate()
  periodEnd: Date;
}
