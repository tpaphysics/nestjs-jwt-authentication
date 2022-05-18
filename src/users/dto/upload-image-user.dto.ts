import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

export class UpdateUserWithThumbnailDto extends UpdateUserDto {
  @IsOptional()
  name?: string;
  @IsOptional()
  email?: string;
  @IsOptional()
  age?: number;
  @IsOptional()
  password?: string;
  @IsOptional()
  gender?: string;
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  file: any;
}
