import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppointmentsService } from '../appointments.service';
import { CreateAppointmentDto } from './create-appointment.dto';

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentsService, PrismaService],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    console.log(process.env);
    expect({ service }).toBeDefined();
  });

  it('Deve retornar erro se o povider_id não for UUID', async () => {
    const myAppointement = {
      date: new Date(),
      provider_id: 'asdasdasdasdads',
    };

    const myAppointementDto = plainToInstance(
      CreateAppointmentDto,
      myAppointement,
    );
    const errors = await validate(myAppointementDto);
    console.log(errors);
    const final = errors.filter(
      (obj) =>
        obj.property === 'provider_id' &&
        JSON.stringify(obj.constraints).includes('isUuid'),
    );
    expect(final.length).toBe(1);
    expect(service).toBeDefined();
  });

  it('Deve retornar erro se não for uma data', async () => {
    const myAppointement = {
      date: 'çlkçlkçkç',
      provider_id: randomUUID(),
    };

    const myAppointementDto = plainToInstance(
      CreateAppointmentDto,
      myAppointement,
    );
    const errors = await validate(myAppointementDto);
    console.log(errors);
    const final = errors.filter(
      (obj) =>
        obj.property === 'date' &&
        JSON.stringify(obj.constraints).includes('isDate'),
    );
    //console.log(final);
    expect(final.length).toBe(1);
    expect(service).toBeDefined();
  });

  it('Deve retornar erro se uma data estiver no passado', async () => {
    const myAppointement = {
      date: '2022-04-02T22:48:06.970Z', //Data Passada
      provider_id: randomUUID(),
    };
    const myAppointementDto = plainToInstance(
      CreateAppointmentDto,
      myAppointement,
    );
    const errors = await validate(myAppointementDto);
    console.log(errors);
    const final = errors.filter(
      (obj) =>
        obj.property === 'date' &&
        JSON.stringify(obj.constraints).includes('minDate'),
    );
    //console.log(final);
    expect(final.length).toBe(1);
    expect(service).toBeDefined();
  });

  it('Deve retornar erro se a hora for menor que 8h da manhã', async () => {
    const myAppointement = {
      date: new Date(2022, 9 - 1, 2, 7, 0, 0),
      provider_id: randomUUID(),
    };

    const myAppointementDto = plainToInstance(
      CreateAppointmentDto,
      myAppointement,
    );
    const errors = await validate(myAppointementDto);
    console.log(errors);
    const final = errors.filter(
      (obj) =>
        obj.property === 'date' &&
        JSON.stringify(obj.constraints).includes('isValidAppointmentTimes'),
    );
    expect(final.length).toBe(1);
    expect(service).toBeDefined();
  });

  it('Deve retornar erro se a hora for maior que 20h da noite', async () => {
    const myAppointement = {
      date: new Date(2022, 9 - 1, 2, 21, 0, 0),
      provider_id: randomUUID(),
    };

    const myAppointementDto = plainToInstance(
      CreateAppointmentDto,
      myAppointement,
    );
    const errors = await validate(myAppointementDto);
    console.log(errors);
    const final = errors.filter(
      (obj) =>
        obj.property === 'date' &&
        JSON.stringify(obj.constraints).includes('isValidAppointmentTimes'),
    );
    expect(final.length).toBe(1);
    expect(service).toBeDefined();
  });

  it('Deve retornar erro se a hora for 12h, almoço', async () => {
    const myAppointement = {
      date: new Date(2022, 9 - 1, 2, 12, 0, 0),
      provider_id: randomUUID(),
    };

    const myAppointementDto = plainToInstance(
      CreateAppointmentDto,
      myAppointement,
    );
    const errors = await validate(myAppointementDto);
    console.log(errors);
    const final = errors.filter(
      (obj) =>
        obj.property === 'date' &&
        JSON.stringify(obj.constraints).includes('isValidAppointmentTimes'),
    );
    expect(final.length).toBe(1);
    expect(service).toBeDefined();
  });

  it('Deve retornar erro se os minutos forem diferente de 0', async () => {
    const myAppointement = {
      date: new Date(2022, 10 - 1, 2, 13, 1, 0),
      provider_id: randomUUID(),
    };

    const myAppointementDto = plainToInstance(
      CreateAppointmentDto,
      myAppointement,
    );
    const errors = await validate(myAppointementDto);
    console.log(errors);
    const final = errors.filter(
      (obj) =>
        obj.property === 'date' &&
        JSON.stringify(obj.constraints).includes('isValidAppointmentTimes'),
    );
    expect(final.length).toBe(1);
    expect(service).toBeDefined();
  });

  it('Deve retornar erro se os segundos forem diferente de 0', async () => {
    const myAppointement = {
      date: new Date(2022, 10 - 1, 2, 13, 0, 1),
      provider_id: randomUUID(),
    };

    const myAppointementDto = plainToInstance(
      CreateAppointmentDto,
      myAppointement,
    );
    const errors = await validate(myAppointementDto);
    console.log(errors);
    const final = errors.filter(
      (obj) =>
        obj.property === 'date' &&
        JSON.stringify(obj.constraints).includes('isValidAppointmentTimes'),
    );
    expect(final.length).toBe(1);
    expect(service).toBeDefined();
  });
});
