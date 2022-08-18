import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from '../appointments/appointments.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ProvidersService } from './providers.service';

/* describe('ListProviderMonthAvailability', () => {
  let service: ProvidersService;
  let prisma: PrismaService;
  let provider: User;
  let client: User;
  const createClient = {
    name: 'a',
    email: 'a@a.com',
    password: '1',
  };
  const createProvider = {
    name: 'b',
    email: 'b@b.com',
    password: '1',
  };

  //beforeEach(async () => {});

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvidersService,
        PrismaService,
        AppointmentsService,
        UsersService,
      ],
    }).compile();

    service = module.get<ProvidersService>(ProvidersService);
    prisma = module.get<PrismaService>(PrismaService);

    client = await prisma.user.create({ data: createClient });
    provider = await prisma.user.create({ data: createProvider });
    const app1 = await prisma.appointments.create({
      data: {
        date: new Date(2023, 10, 12, 13, 0, 0),
        provider_id: provider.id,
        client_id: client.id,
      },
    });
    const app2 = await prisma.appointments.create({
      data: {
        date: new Date(2023, 10, 12, 14, 0, 0),
        provider_id: provider.id,
        client_id: client.id,
      },
    });
    //console.log(app1, app2);
  });

  it('should be defined', async () => {
    expect({ prisma, service, client, provider }).toBeDefined();
  });

  it('Deve gerar ao erro ao entar com um mês ou ano de uma data passada', async () => {
    const res = await service
      .listProviderMonthAvailability(
        {
          provider_id: provider.id,
        },
        { month: 1, year: 2022 },
      )
      .catch((err) => {
        expect(err.status).toBe(400);
      });
    expect(res).not.toBeDefined();
  });

  it('Os dias no passado devem estar com availability false', async () => {
    const hours = [8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19];
    const appointments = hours.map((hour) => {
      return {
        date: new Date(2022, 7, 7, hour, 0, 0),
        provider_id: provider.id,
        client_id: client.id,
      };
    });
    await prisma.appointments.createMany({ data: appointments });

    //console.log(await prisma.appointments.findMany());
    const listAvailability = await service.listProviderMonthAvailability(
      {
        provider_id: provider.id,
      },
      { month: 8, year: 2022 },
    );

    const inPast = listAvailability.filter((obj) => {
      return (
        isBefore(
          new Date(2022, 7, obj.day),
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
          ),
        ) && obj.availability === false
      );
    });
    expect(inPast.length).toBe(new Date().getDate() - 1);

    //console.log(res);
  });

  it('Os dias com 12 agendamentos devem estar com avaiability false', async () => {
    const hours = [20];
    const appointments = hours.map((hour) => {
      return {
        date: new Date(2022, 7, 7, hour, 0, 0),
        provider_id: provider.id,
        client_id: client.id,
      };
    });
    await prisma.appointments.createMany({ data: appointments });

    //console.log(await prisma.appointments.findMany());
    const listAvailability = await service.listProviderMonthAvailability(
      {
        provider_id: provider.id,
      },
      { month: 8, year: 2022 },
    );

    // console.log(listAvailability);

    const result = listAvailability.filter(
      (obj) =>
        obj.day === 7 &&
        obj.availability === false &&
        obj.number_of_Appointments === 12,
    );

    expect(result.length).toBe(1);

    //console.log(res);
  });

  it('Se o dia for domingo deve retonar availability false', async () => {
    //console.log(await prisma.appointments.findMany());
    const listAvailability = await service.listProviderMonthAvailability(
      {
        provider_id: provider.id,
      },
      { month: 10, year: 2022 },
    );

    console.log(listAvailability);

    const result = listAvailability.filter(
      (obj) =>
        [2, 9, 16, 23, 30].includes(obj.day) &&
        obj.availability === false &&
        obj.number_of_Appointments === 0,
    );

    //console.log(result);

    expect(result.length).toBe(5);
  });

  afterAll(async () => {
    const deleteAppointments = prisma.appointments.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteAppointments, deleteUsers]);

    await prisma.$disconnect();
  });
});
*/

describe('ProviderDayAvailability', () => {
  let service: ProvidersService;
  let prisma: PrismaService;
  let provider: User;
  let client: User;
  const createClient = {
    name: 'a',
    email: 'a@a.com',
    password: '1',
  };
  const createProvider = {
    name: 'b',
    email: 'b@b.com',
    password: '1',
  };

  //beforeEach(async () => {});

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvidersService,
        PrismaService,
        AppointmentsService,
        UsersService,
      ],
    }).compile();

    service = module.get<ProvidersService>(ProvidersService);
    prisma = module.get<PrismaService>(PrismaService);

    client = await prisma.user.create({ data: createClient });
    provider = await prisma.user.create({ data: createProvider });
    const app1 = await prisma.appointments.create({
      data: {
        date: new Date(2023, 10, 12, 13, 0, 0),
        provider_id: provider.id,
        client_id: client.id,
      },
    });
    const app2 = await prisma.appointments.create({
      data: {
        date: new Date(2023, 10, 12, 14, 0, 0),
        provider_id: provider.id,
        client_id: client.id,
      },
    });
    //console.log(app1, app2);
  });

  it('should be defined', async () => {
    expect({ prisma, service, client, provider }).toBeDefined();
  });

  it('Na hora almoço não deve haver disponibilidade', async () => {
    const res = await service.listProviderDayAvailability(
      { provider_id: provider.id },
      { month: 12, day: 3, year: 2022 },
    );
    const a = res.filter((obj) => {
      return obj.hour === 12;
    });
    expect(a.length).toBe(0);
  });

  it('Não deve haver disponibilidade antes das 8h', async () => {
    const res = await service.listProviderDayAvailability(
      { provider_id: provider.id },
      { month: 12, day: 3, year: 2022 },
    );
    const a = res.filter((obj) => {
      return obj.hour < 7;
    });
    expect(a.length).toBe(0);
  });

  it('Não deve haver disponibilidade antes das 20h', async () => {
    const res = await service.listProviderDayAvailability(
      { provider_id: provider.id },
      { month: 12, day: 3, year: 2022 },
    );
    const a = res.filter((obj) => {
      return obj.hour > 20;
    });
    expect(a.length).toBe(0);
  });

  it('Deve gerar erro ao verificar disponibilidade de uma data passada', async () => {
    const res = await service
      .listProviderDayAvailability(
        { provider_id: provider.id },
        { month: 12, day: 3, year: 2021 },
      )
      .catch((err) => expect(err).toBeDefined());
    expect(res).not.toBeDefined();
  });

  it('Se o agendamento é na data atual, horas que estão no passado devem estar com availability false', async () => {
    await prisma.appointments.create({
      data: {
        date: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          20,
          0,
          0,
        ),
        provider_id: provider.id,
        client_id: client.id,
      },
    }); // Agendamento para às 20h da data atual
    const res = await service.listProviderDayAvailability(
      { provider_id: provider.id },
      {
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        year: new Date().getFullYear(),
      }, //Data atual
    );

    const filter = res.filter((obj) => {
      return obj.hour <= new Date().getHours();
    });

    const filter1 = filter.filter((obj) => {
      return obj.availability === true;
    });

    expect(filter1.length).toBe(0);

    // .catch((err) => expect(err).toBeDefined());
    //expect(res).not.toBeDefined();
  });

  afterAll(async () => {
    const deleteAppointments = prisma.appointments.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteAppointments, deleteUsers]);

    await prisma.$disconnect();
  });
});
