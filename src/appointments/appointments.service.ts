import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ListProviderMonthAvailabilityDto } from './dto/list-provider-month-availability.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import {
  format,
  getDate,
  getDaysInMonth,
  getHours,
  getMonth,
  getYear,
} from 'date-fns';
import { raw } from '@prisma/client/runtime';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Prisma } from '@prisma/client';
import { Appointment } from './entities/appointment.entity';
import { ListProviderDayAvailabilityDto } from './dto/list-provider-day-availability.dto';
import { IsPublicRoute } from 'src/auth/decorators/is-public-route.decorator';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAppointmentDto, currentUser: User) {
    const { id } = currentUser;
    const { provider_id, date } = data;

    if (id === provider_id) {
      throw new BadRequestException("You can't create an aging with yourself!");
    }

    const existProvider = await this.prisma.user.findUnique({
      where: {
        id: provider_id,
      },
    });

    if (!existProvider) {
      throw new BadRequestException('The service provider does not exist!');
    }

    const checkDayAvailability = `${format(date, 'dd-MM-yyyy')}`;
    const appointments = await this.prisma.$queryRaw<Appointment[]>`
    SELECT * FROM 
    appointments 
    WHERE 
    provider_id=${provider_id}
    AND
    to_char(date,'DD-MM-YYYY')=${checkDayAvailability}
    `;

    const existAppointmentInHour = appointments.filter((appointment) => {
      return getHours(new Date(appointment.date)) == getHours(date);
    });

    if (existAppointmentInHour.length !== 0) {
      throw new BadRequestException('This time is not available!');
    }

    return await this.prisma.appointments.create({
      data: {
        ...data,
        client_id: id,
      },
    });
  }

  async findAll() {
    return await this.prisma.appointments.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.appointments.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, data: UpdateAppointmentDto) {
    return await this.prisma.appointments.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.appointments.delete({
      where: {
        id,
      },
    });
  }
  async listProviderMonthAvailability(
    listProviderMonthAvailabilityDto: ListProviderMonthAvailabilityDto,
  ): Promise<any> {
    const { year, month, provider_id } = listProviderMonthAvailabilityDto;
    const parsedMonth = String(month).padStart(2, '0');
    const checkMonthAvailability = `${parsedMonth}-${year}`;

    const appointments = await this.prisma.$queryRaw<Appointment[]>`
    SELECT * FROM 
    appointments 
    WHERE 
    provider_id=${provider_id}
    AND
    to_char(date,'MM-YYYY')=${checkMonthAvailability}
    `;
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const numberOfDaysArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const availability = numberOfDaysArray.map((day) => {
      const appointmentsInDay = appointments.filter((appointment) => {
        return getDate(new Date(appointment.date)) === day;
      });
      return {
        day,
        availability: appointmentsInDay.length < 12,
      };
    });
    return availability;
  }
  async listProviderDayAvailability(
    listProviderDayAvailabilityDto: ListProviderDayAvailabilityDto,
  ): Promise<any> {
    const { day, month, year, provider_id } = listProviderDayAvailabilityDto;

    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');
    const checkDayAvailability = `${parsedDay}-${parsedMonth}-${year}`;

    const appointments = await this.prisma.$queryRaw<Appointment[]>`
    SELECT * FROM 
    appointments 
    WHERE 
    provider_id=${provider_id}
    AND
    to_char(date,'DD-MM-YYYY')=${checkDayAvailability}
    `;

    const numberOfAppointmentsInDay = 12; // 08h00 at 21h00
    const startWork = 8;
    const finalWork = 21;
    const numberOfHoursArray = Array.from(
      {
        length: numberOfAppointmentsInDay,
      },
      (_, index) =>
        index + startWork >= 12 ? index + 1 + startWork : index + startWork,
    );
    const availability = numberOfHoursArray.map((hour) => {
      const appointmentsInHour = appointments.find((appointment) => {
        return getHours(new Date(appointment.date)) === hour;
      });
      return {
        hour,
        availability: !appointmentsInHour,
      };
    });
    return availability;
  }
}
