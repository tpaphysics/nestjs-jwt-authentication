import { IsNumber, IsUUID, Max, Min } from 'class-validator';
import { getYear } from 'date-fns';

export class ListProviderMonthAvailabilityDto {
  @IsUUID()
  provider_id: string;
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;
  @IsNumber()
  @Max(getYear(new Date()))
  year: number;
}
