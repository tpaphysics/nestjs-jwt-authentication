import faker from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class Appointment implements Prisma.appointmentsUncheckedCreateInput {
  @ApiProperty({ default: faker.datatype.uuid() })
  id?: string;
  @ApiProperty({ default: faker.datatype.datetime() })
  date: string | Date;
  @ApiProperty({ default: faker.datatype.datetime() })
  createdAt?: string | Date;
  @ApiProperty({ default: faker.datatype.datetime() })
  updateAt?: string | Date;
  @ApiProperty({ default: faker.datatype.uuid() })
  providerId: string;
}
