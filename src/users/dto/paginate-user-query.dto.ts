import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { User } from '../entities/user.entity';

export class PaginateUserQueryDto extends User {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  take: number;
}
