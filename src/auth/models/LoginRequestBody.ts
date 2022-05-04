import faker from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginRequestBody {
  @ApiProperty({ default: faker.internet.email() })
  @IsEmail()
  email: string;

  @ApiProperty({ default: faker.internet.password })
  @IsString()
  password: string;
}
