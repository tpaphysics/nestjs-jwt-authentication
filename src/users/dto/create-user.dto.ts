import { User } from '../entities/user.entity';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';

export class CreateUserDto {
  @ApiProperty({ default: faker.internet.email().toLocaleLowerCase() })
  @IsString()
  //@IsEmail()
  email: string;

  @ApiProperty({ default: faker.internet.userName().toLocaleLowerCase() })
  @IsString()
  //@Matches(/[a-zA-Z0-9_-]{2,20}/)
  name: string;

  @IsString()
  //@MinLength(6)
  //@MaxLength(20)
  //@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  // message: 'Password too weak!',
  //})
  @ApiProperty({ default: 'password' })
  password: string;

  @ApiProperty({
    default: faker.datatype.number({
      min: 14,
      max: 70,
    }),
  })
  @IsInt()
  //@Min(1)
  //@Max(120)
  age: number;

  @ApiProperty({ default: 'masculine' })
  @IsString()
  //@IsIn(['masculine', 'feminine'])
  gender: string;
}
