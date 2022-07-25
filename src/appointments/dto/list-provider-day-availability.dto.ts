import { IsNumber, IsUUID, Max, Min } from 'class-validator';
import { getMonth, getYear } from 'date-fns';

export class ListProviderDayAvailabilityDto {
  @IsUUID()
  provider_id: string;
  @IsNumber()
  day: number;
  @IsNumber()
  month: number;
  @IsNumber()
  @Min(getYear(new Date()))
  year: number;
}
