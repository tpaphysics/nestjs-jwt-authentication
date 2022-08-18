import { BadRequestException, Injectable, Query } from '@nestjs/common';
import { getDaysInMonth, getDate, isAfter, isEqual, getHours } from 'date-fns';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { findAllUserDto } from '../users/dto/findAll-user.dto';
import { User } from '../users/entities/user.entity';
import FindAllUserResponse from '../users/model/find-all-users-response.type';
import { UsersService } from '../users/users.service';
import { ProviderIdParamDto } from './dto/list-provider-month-availability.param.dto';
import { ProviderMonthAvailabilityQueryDto } from './dto/list-provider-month-availability.query.dto';
import { ProviderDayAvailabilityDto } from './dto/provider-day-availability.query.dto';
import { ListProviderMonthAvailabilityResponse } from './models/list-provider-month-availability.type';

@Injectable()
export class ProvidersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async listProviderMonthAvailability(
    param: ProviderIdParamDto,
    query: ProviderMonthAvailabilityQueryDto,
  ): Promise<ListProviderMonthAvailabilityResponse[]> {
    const { provider_id } = param;
    const { month, year } = query;

    if (
      year < new Date().getFullYear() ||
      (year === new Date().getFullYear() && month - 1 < new Date().getMonth())
    ) {
      throw new BadRequestException('Availability must be a future date!');
    }

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
    console.log(appointments);
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const numberOfDaysArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const availability = numberOfDaysArray.map((day) => {
      const appointmentsInDay = appointments.filter((appointment) => {
        return getDate(new Date(appointment.date)) === day;
      });
      const numberAppointments = appointmentsInDay.length < 12;

      const isAfterDate = isAfter(
        new Date(year, month - 1, day),
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
        ),
      );
      const isIqualDate = isEqual(
        new Date(year, month - 1, day),
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
        ),
      );
      const isNotSunday = new Date(year, month - 1, day).getDay() !== 0;

      const isValidDate = isAfterDate || isIqualDate;

      return {
        day,
        availability:
          numberAppointments && isValidDate && isNotSunday ? true : false,
        number_of_Appointments: appointmentsInDay.length,
        //valid: `${numberAppointments}-${isValidDate} `,
      };
    });
    return availability;
  }

  async listProviderDayAvailability(
    param: ProviderIdParamDto,
    query: ProviderDayAvailabilityDto,
  ) {
    const { provider_id } = param;
    const { day, month, year } = query;

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

  async findAllProvidersExceptCurrentUser(
    @Query() query: findAllUserDto,
    curentUser: User,
  ): Promise<FindAllUserResponse> {
    return await this.usersService.findAll(query, curentUser);
  }
}
