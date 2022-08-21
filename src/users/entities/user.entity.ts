import faker from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class User {
  @ApiProperty({ example: faker.datatype.uuid() })
  id?: string;
  @ApiProperty({ example: 'urban@shaves.com' })
  email: string;
  @ApiProperty({ example: 'urban' })
  name: string;
  @ApiProperty({ example: 'myPassword' })
  @Exclude()
  password: string;
  @ApiProperty({ example: 'avatar.png' })
  avatar?: string;
  @ApiProperty({ example: new Date(2022, 6, 12, 17, 0, 0) })
  created_at?: string | Date;
  @ApiProperty({ example: new Date(2022, 6, 11, 17, 0, 0) })
  updated_at?: string | Date;
}
