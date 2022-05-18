import faker from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ default: faker.datatype.uuid() })
  id?: string;
  @ApiProperty({ default: faker.internet.email() })
  email: string;
  @ApiProperty({ default: faker.internet.userName() })
  name: string;
  password: string;
  @ApiProperty({ default: faker.internet.url() })
  avatar?: string;
  @ApiProperty({ default: Date.now() })
  createdAt?: string | Date;
  @ApiProperty({ default: Date.now() })
  updateAt?: string | Date;
}
