import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProvidersService } from './providers.service';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ListProviderMonthAvailabilityResponse } from './models/list-provider-month-availability.type';
import { ProviderIdParamDto } from './dto/list-provider-month-availability.param.dto';
import { ProviderMonthAvailabilityQueryDto } from './dto/list-provider-month-availability.query.dto';
import { ListProviderDayAvailabilityDto } from './dto/provider-day-availability.query.dto';
import { ListProviderDayAvailabilityResponse } from './models/list-provider-day-availability-type';
import { findAllUserDto } from '../users/dto/findAll-user.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import FindAllUserResponse from '../users/model/find-all-users-response.type';
import { UsersService } from '../users/users.service';

@Controller('providers')
@ApiTags('Providers')
@ApiBearerAuth()
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  @ApiOperation({ summary: 'list of providers except current user' })
  @ApiResponse({
    status: 200,
    description: 'List providers ok',
    type: [FindAllUserResponse],
  })
  async findAllProvidersExceptCurrentUser(
    @Query() query: findAllUserDto,
    @CurrentUser() user: User,
  ): Promise<FindAllUserResponse> {
    return await this.providersService.findAllProvidersExceptCurrentUser(
      query,
      user,
    );
  }

  @Get(':provider_id/month-availability')
  @ApiOperation({ summary: 'List provider month availability' })
  @ApiResponse({
    status: 200,
    description: 'Month availability respose ok',
    type: [ListProviderMonthAvailabilityResponse],
  })
  async listProviderMonthAvailability(
    @Param() param: ProviderIdParamDto,
    @Query() query: ProviderMonthAvailabilityQueryDto,
  ): Promise<ListProviderMonthAvailabilityResponse[]> {
    return await this.providersService.listProviderMonthAvailability(
      param,
      query,
    );
  }
  @Get(':provider_id/day-availability')
  @ApiOperation({ summary: 'List provider day availability' })
  @ApiResponse({
    status: 200,
    description: 'Day availability respose ok',
    type: [ListProviderDayAvailabilityResponse],
  })
  async listProviderDayAvailability(
    @Param() param: ProviderIdParamDto,
    @Query() query: ListProviderDayAvailabilityDto,
  ): Promise<any> {
    return await this.providersService.listProviderDayAvailability(
      param,
      query,
    );
  }
}
