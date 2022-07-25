import faker from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class Appointment implements Prisma.appointmentsUncheckedCreateInput {
  @ApiProperty({ default: faker.datatype.uuid() })
  id?: string;
  @ApiProperty({ default: faker.datatype.datetime() })
  date: Date;
  @ApiProperty({ default: faker.datatype.uuid() })
  provider_id: string;
  @ApiProperty({ default: faker.datatype.uuid() })
  client_id: string;
  @ApiProperty({ default: faker.datatype.datetime() })
  created_at?: Date;
  @ApiProperty({ default: faker.datatype.datetime() })
  updated_at?: Date;
}
