import { IsUUID, isUUID } from 'class-validator';
import { CheckInDataBase } from 'src/decorators/check-in-database.decorator';

export class ListProviderMonthAvailabilityParamDto {
  @IsUUID()
  provider_id: string;
}
