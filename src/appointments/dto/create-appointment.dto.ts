import faker from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  isEmail,
  isString,
  isUUID,
  IsUUID,
  MinDate,
  ValidateNested,
} from 'class-validator';
import { ThereIsInDataBase } from 'src/decorators/there-is-in-database.decorator';
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
  @ThereIsInDataBase({
    model: 'user',
    field: 'id',
    validators: [isUUID, isString],
  })
  provider_id: string;
}
