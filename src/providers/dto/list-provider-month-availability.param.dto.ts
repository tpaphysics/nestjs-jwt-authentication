import { isUUID } from 'class-validator';
import { CheckInDataBase } from 'src/decorators/check-in-database.decorator';

export class ListProviderMonthAvailabilityParamDto {
  @CheckInDataBase({
    model: 'user',
    field: 'id',
    validators: [
      {
        validationCallback: isUUID,
        message: 'Field is not valid UUID!',
      },
    ],
  })
  provider_id: string;
}
