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

export class CreateUserDto extends User {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/[a-zA-Z0-9_-]{2,20}/)
  name: string;

  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak!',
  })
  password: string;

  @IsInt()
  @Min(1)
  @Max(120)
  age: number;

  @IsString()
  @IsIn(['masculine', 'feminine'])
  gender: string;
}
