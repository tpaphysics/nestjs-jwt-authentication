import faker from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class User implements Prisma.userUncheckedCreateInput {
  @ApiProperty({ default: faker.datatype.uuid() })
  id?: string;
  @ApiProperty({ default: faker.internet.email() })
  email: string;
  @ApiProperty({ default: faker.internet.userName() })
  name: string;
  password: string;
  @ApiProperty({ default: faker.datatype.number({ max: 100, min: 22 }) })
  age: number;
  @ApiProperty({ default: 'masculine' })
  gender: string;
  @ApiProperty({ default: faker.internet.url() })
  avatarFileName?: string;
  @ApiProperty({ default: Date.now() })
  createdAt?: string | Date;
  @ApiProperty({ default: Date.now() })
  updateAt?: string | Date;
}
