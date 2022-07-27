import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProvidersService } from './providers.service';

import { ListProviderMonthQueryDto } from './dto/list-provider-month-query.dto';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get(':provider_id/month-availability')
  async listProviderMonthAvailability(
    @Param('provider_id', new ParseUUIDPipe()) provider_id: string,
    @Query() query: ListProviderMonthQueryDto,
  ) {
    return await this.providersService.listProviderMonthAvailability(
      provider_id,
      query,
    );
  }
}
