import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProvidersService } from './providers.service';

import { ListProviderMonthAvailabilityQueryDto } from './dto/list-provider-month-availability.query.dto';
import { ListProviderMonthAvailabilityParamDto } from './dto/list-provider-month-availability.param.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ListProviderMonthAvailabilityResponse } from './models/list-provider-month-availability.type';

@Controller('providers')
@ApiTags('Providers')
@ApiBearerAuth()
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get(':provider_id/month-availability')
  @ApiOperation({ summary: 'List provider month availability' })
  @ApiResponse({
    status: 200,
    description: 'Month availability respose ok',
    type: [ListProviderMonthAvailabilityResponse],
  })
  async listProviderMonthAvailability(
    @Param() param: ListProviderMonthAvailabilityParamDto,
    @Query() query: ListProviderMonthAvailabilityQueryDto,
  ): Promise<ListProviderMonthAvailabilityResponse[]> {
    return await this.providersService.listProviderMonthAvailability(
      param,
      query,
    );
  }
}
