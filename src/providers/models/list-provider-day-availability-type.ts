import { ApiProperty } from '@nestjs/swagger';

export class ListProviderDayAvailabilityResponse {
  @ApiProperty({ example: 15 })
  hour: number;
  @ApiProperty({ example: true })
  availability: boolean;
}
