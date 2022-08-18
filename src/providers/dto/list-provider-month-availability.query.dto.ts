import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Min, Max } from 'class-validator';
import { getYear } from 'date-fns';

export class ProviderMonthAvailabilityQueryDto {
  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @Min(new Date().getMonth())
  @Max(12)
  month: number;
  @ApiProperty({ example: new Date().getFullYear() })
  @Type(() => Number)
  @Min(getYear(new Date()))
  year: number;
}
