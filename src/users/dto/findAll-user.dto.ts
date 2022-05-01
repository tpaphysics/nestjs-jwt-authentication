import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { User } from '../entities/user.entity';

export class findAllUserDto extends User {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  take: number;
}
