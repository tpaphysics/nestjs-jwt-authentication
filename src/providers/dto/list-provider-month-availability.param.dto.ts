import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { randomUUID } from 'crypto';

export class ProviderIdParamDto {
  @ApiProperty({ example: randomUUID() })
  @IsUUID()
  provider_id: string;
}
