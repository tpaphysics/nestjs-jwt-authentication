import { IsNumber, IsUUID, Max, Min } from 'class-validator';
import { getYear } from 'date-fns';

export class ListProviderDayAvailabilityDto {
  @IsUUID()
  provider_id: string;
  @IsNumber()
  day: number;
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;
  @IsNumber()
  @Min(getYear(new Date()))
  year: number;
}
