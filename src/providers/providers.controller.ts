import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProvidersService } from './providers.service';

import { ListProviderMonthAvailabilityQueryDto } from './dto/list-provider-month-availability.query.dto';
import { ListProviderMonthAvailabilityParamDto } from './dto/list-provider-month-availability.param.dto';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get(':provider_id/month-availability')
  async listProviderMonthAvailability(
    @Param() param: ListProviderMonthAvailabilityParamDto,
    @Query() query: ListProviderMonthAvailabilityQueryDto,
  ) {
    return await this.providersService.listProviderMonthAvailability(
      param,
      query,
    );
  }
}
