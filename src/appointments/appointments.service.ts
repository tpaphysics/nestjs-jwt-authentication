import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateAppointmentDto) {
    return await this.prisma.appointments.create({
      data,
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
}
