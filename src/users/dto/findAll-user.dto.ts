import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class findAllUserDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  take: number;
}
