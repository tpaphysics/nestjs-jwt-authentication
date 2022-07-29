import { Injectable } from '@nestjs/common';
import { getDaysInMonth, getDate } from 'date-fns';
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
}
