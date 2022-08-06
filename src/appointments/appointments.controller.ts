import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ListProviderDayAvailabilityDto } from './dto/list-provider-day-availability.dto';
import { ListProviderMonthAvailabilityDto } from './dto/list-provider-month-availability.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@ApiTags('CRUD')
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create appointement' })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @CurrentUser() currentUser: User,
  ): Promise<Appointment> {
    return await this.appointmentsService.create(
      createAppointmentDto,
      currentUser,
    );
  }
  @Post('provider/month')
  async listProviderMonthAvailability(
    @Body() listProviderMonthAvailabilityDto: ListProviderMonthAvailabilityDto,
  ): Promise<any> {
    return await this.appointmentsService.listProviderMonthAvailability(
      listProviderMonthAvailabilityDto,
    );
  }
  @Post('provider/day')
  async listProviderDayAvailability(
    @Body() listProviderDayAvailabilityDto: ListProviderDayAvailabilityDto,
  ): Promise<any> {
    return await this.appointmentsService.listProviderDayAvailability(
      listProviderDayAvailabilityDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Find appointments' })
  async findAll() {
    return await this.appointmentsService.findAll();
  }

  @ApiOperation({ summary: 'Find appointment' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update appointment' })
  @ApiBody({
    description: 'ThubnailUser',
    type: UpdateAppointmentDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return await this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.appointmentsService.remove(id);
  }
}
