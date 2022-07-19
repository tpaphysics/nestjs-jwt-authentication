import faker from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotDto {
  @ApiProperty({ default: faker.internet.email().toLocaleLowerCase() })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
