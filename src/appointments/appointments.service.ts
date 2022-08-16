import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { format, getHours } from 'date-fns';

import { Appointment } from './entities/appointment.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAppointmentDto, currentUser: User) {
    const { id } = currentUser;
    const { provider_id, date } = data;

    if (id === provider_id) {
      throw new BadRequestException("You can't create an aging with yourself!");
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

    try {
      return await this.prisma.appointments.create({
        data: {
          ...data,
          client_id: id,
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException('The client does not exist!');
      }
    }
  }

  async findAll(curentUser: User) {
    const { id } = curentUser;
    return await this.prisma.appointments.findMany({
      where: {
        client_id: id,
      },
    });
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
}
