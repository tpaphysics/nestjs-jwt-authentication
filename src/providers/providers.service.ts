import { BadRequestException, Injectable } from '@nestjs/common';
import {
  getDaysInMonth,
  getDate,
  isAfter,
  isBefore,
  isEqual,
  getDay,
} from 'date-fns';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListProviderMonthAvailabilityParamDto } from './dto/list-provider-month-availability.param.dto';
import { ListProviderMonthAvailabilityQueryDto } from './dto/list-provider-month-availability.query.dto';

@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  async listProviderMonthAvailability(
    param: ListProviderMonthAvailabilityParamDto,
    query: ListProviderMonthAvailabilityQueryDto,
  ): Promise<any> {
    const { provider_id } = param;
    const { month, year } = query;
    console.log(query);

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
}
