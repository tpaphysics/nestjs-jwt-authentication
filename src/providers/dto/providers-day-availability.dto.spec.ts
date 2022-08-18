import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppointmentsService } from '../../appointments/appointments.service';
import { CreateAppointmentDto } from '../../appointments/dto/create-appointment.dto';
import { ProviderIdParamDto } from './list-provider-month-availability.param.dto';
import { ProviderDayAvailabilityDto } from './provider-day-availability.query.dto';

describe('ProviderIdParamDto', () => {
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
      ProviderIdParamDto,
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

  it('Deve retornar erro se o agendamento for no domingo', async () => {
    const myAppointement = {
      date: new Date(2022, 7, 7, 13, 0, 0),
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

describe('ProviderDayAvailabilityDto', () => {
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

  it('Deve retornar erro se o dia for igual a 0', async () => {
    const dayAvailability = {
      day: 0,
      month: 12,
      year: 2022,
    } as ProviderDayAvailabilityDto;

    const myAppointementDto = plainToInstance(
      ProviderDayAvailabilityDto,
      dayAvailability,
    );
    const errors = await validate(myAppointementDto);
    console.log(errors);
    const final = errors.filter(
      (obj) =>
        obj.property === 'day' &&
        JSON.stringify(obj.constraints).includes('min'),
    );
    expect(final.length).toBe(1);
    expect(service).toBeDefined();
  });

  it('Deve retornar erro se o dia for maior que 31', async () => {
    const dayAvailability = {
      day: 32,
      month: 12,
      year: 2022,
    } as ProviderDayAvailabilityDto;

    const myAppointementDto = plainToInstance(
      ProviderDayAvailabilityDto,
      dayAvailability,
    );
    const errors = await validate(myAppointementDto);
    console.log(errors);
    const final = errors.filter(
      (obj) =>
        obj.property === 'day' &&
        JSON.stringify(obj.constraints).includes('max'),
    );
    expect(final.length).toBe(1);
    expect(service).toBeDefined();
  });

  it('Deve retornar erro se o mês for maior menor que 1', async () => {
    const dayAvailability = {
      day: 31,
      month: 0,
      year: 2022,
    } as ProviderDayAvailabilityDto;

    const myAppointementDto = plainToInstance(
      ProviderDayAvailabilityDto,
      dayAvailability,
    );
    const errors = await validate(myAppointementDto);
    console.log(errors);
    const final = errors.filter(
      (obj) =>
        obj.property === 'month' &&
        JSON.stringify(obj.constraints).includes('min'),
    );
    expect(final.length).toBe(1);
    expect(service).toBeDefined();
  });

  it('Deve retornar erro se o mês for maior que 12', async () => {
    const dayAvailability = {
      day: 31,
      month: 13,
      year: 2022,
    } as ProviderDayAvailabilityDto;

    const myAppointementDto = plainToInstance(
      ProviderDayAvailabilityDto,
      dayAvailability,
    );
    const errors = await validate(myAppointementDto);
    console.log(errors);
    const final = errors.filter(
      (obj) =>
        obj.property === 'month' &&
        JSON.stringify(obj.constraints).includes('max'),
    );
    expect(final.length).toBe(1);
    expect(service).toBeDefined();
  });

  it('Deve retornar erro se o ano for menor que o ano atual', async () => {
    const dayAvailability = {
      day: 31,
      month: 11,
      year: 2021,
    } as ProviderDayAvailabilityDto;

    const myAppointementDto = plainToInstance(
      ProviderDayAvailabilityDto,
      dayAvailability,
    );
    const errors = await validate(myAppointementDto);
    console.log(errors);
    const final = errors.filter(
      (obj) =>
        obj.property === 'year' &&
        JSON.stringify(obj.constraints).includes('min'),
    );
    expect(final.length).toBe(1);
    expect(service).toBeDefined();
  });
});
