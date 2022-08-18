import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Min, Max } from 'class-validator';
import { getYear } from 'date-fns';

export class ProviderDayAvailabilityDto {
  @ApiProperty({ example: 16 })
  @Type(() => Number)
  @Min(1)
  @Max(31)
  day: number;
  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @Min(1)
  @Max(12)
  month: number;
  @ApiProperty({ example: new Date().getFullYear() })
  @Type(() => Number)
  @Min(getYear(new Date()))
  year: number;
}
