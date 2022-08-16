import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Min, Max } from 'class-validator';
import { getDaysInMonth, getYear } from 'date-fns';

export class ListProviderDayAvailabilityDto {
  @ApiProperty({ example: 16 })
  @Type(() => Number)
  @Min(1)
  @Max(getDaysInMonth(new Date()))
  day: number;
  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @Min(1)
  @Max(12)
  month: number;
  @ApiProperty({ example: new Date().getFullYear() })
  @Type(() => Number)
  @Max(getYear(new Date()))
  year: number;
}
