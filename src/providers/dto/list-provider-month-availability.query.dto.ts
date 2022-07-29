import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Min, Max } from 'class-validator';
import { getYear } from 'date-fns';

export class ListProviderMonthAvailabilityQueryDto {
  @ApiProperty()
  @Type(() => Number)
  @Min(1)
  @Max(12)
  month: number;
  @ApiProperty()
  @Type(() => Number)
  @Max(getYear(new Date()))
  year: number;
}
