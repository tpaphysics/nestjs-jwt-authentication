import { User } from '../entities/user.entity';
import {
  Equals,
  IsEmail,
  IsIn,
  IsInt,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto extends User {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/[a-zA-Z0-9_-]{2,20}/)
  name: string;

  @IsInt()
  @Min(1)
  @Max(120)
  age: number;

  @IsString()
  @IsIn(['masculine', 'feminine'])
  gender: string;
}
