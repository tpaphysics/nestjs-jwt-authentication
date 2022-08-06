import faker from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsUUID, isUUID, MinDate } from 'class-validator';
import { CheckInDataBase } from 'src/decorators/check-in-database.decorator';

import { IsValidAppointmentTimes } from '../decorators/is-valid-appointment-times.decorator';

export class CreateAppointmentDto {
  @ApiProperty({ default: faker.datatype.datetime() })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date())
  @IsValidAppointmentTimes({
    startTimeOfWorkHour: 8,
    lunchHour: 12,
    endTimeOfWorkHour: 20,
  })
  date: Date;
  @ApiProperty({ default: faker.datatype.uuid() })
  /*@CheckInDataBase({
    model: 'user',
    field: 'id',
    validators: [
      {
        validationCallback: isUUID,
        message: 'Field is not valid UUID!',
      },
    ],
  })*/
  @IsUUID()
  provider_id: string;
}
