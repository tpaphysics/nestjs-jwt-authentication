import faker from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsUUID, MaxDate, MinDate } from 'class-validator';
import { add } from 'date-fns';

export class CreateAppointmentDto {
  @ApiProperty({ default: faker.datatype.datetime() })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  //@MinDate(new Date()) // Now
  //@MaxDate(add(new Date(), { months: 6 })) //Add 3 months after
  date: Date;
  @ApiProperty({ default: faker.datatype.uuid() })
  @IsUUID()
  provider_id: string;
}
