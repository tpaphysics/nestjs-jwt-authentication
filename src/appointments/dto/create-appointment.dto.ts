import faker from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ default: faker.datatype.datetime() })
  @IsString()
  date: string | Date;
  @ApiProperty({ default: faker.datatype.uuid() })
  @IsString()
  providerId: string;
}
