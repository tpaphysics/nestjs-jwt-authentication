import { ApiProperty } from '@nestjs/swagger';

export class ListProviderMonthAvailabilityResponse {
  @ApiProperty({ example: 3 })
  day: number;
  @ApiProperty({ example: true })
  availability: boolean;
  @ApiProperty({ example: 10 })
  number_of_Appointments: number;
}
