import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../users/entities/user.entity';
import { AppointmentsService } from './appointments.service';

describe('Create', () => {
  let service: AppointmentsService;
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
      providers: [AppointmentsService, PrismaService],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    prisma = module.get<PrismaService>(PrismaService);

    client = await prisma.user.create({ data: createClient });
    provider = await prisma.user.create({ data: createProvider });
  });

  it('should be defined', async () => {
    expect({ prisma, service }).toBeDefined();
  });

  it('Deve retornar erro se o provider for igual ao usuário corrente', async () => {
    const appointment = {
      date: new Date(2022, 10, 14, 0, 0),
      provider_id: provider.id,
    };

    await service.create(appointment, provider).catch((err) => {
      expect(err.response.statusCode).toBe(400);
      expect(err).toBeDefined();
    });
  });

  it('Deve retornar erro se o cliente não existir', async () => {
    const appointment = {
      date: new Date(2022, 10, 16, 0, 0),
      provider_id: provider.id,
    };

    await service
      .create(appointment, { ...client, id: randomUUID() })
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.status).toBe(400);
      });
  });

  it('Deve retornar erro se o provider não existir', async () => {
    const appointment = {
      date: new Date(2022, 10, 16, 0, 0),
      provider_id: randomUUID(),
    };

    await service
      .create(appointment, { ...client, id: randomUUID() })
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.status).toBe(400);
      });
  });

  it('Deve criar o agendamento se o cliente existir', async () => {
    const appointment = {
      date: new Date(2022, 10, 16, 0, 0),
      provider_id: provider.id,
    };

    const res = await service.create(appointment, client);
    expect(res.client_id).toBe(client.id);
    expect(res.provider_id).toBe(provider.id);
  });

  it('Deve retornar erro se o agendamento for duplicado ou no mesmo horário de outro', async () => {
    const appointment = {
      date: new Date(2022, 10, 16, 0, 0),
      provider_id: provider.id,
    };

    await service.create(appointment, client).catch((err) => {
      expect(err).toBeDefined();
      expect(err.status).toBe(400);
    });
  });

  afterAll(async () => {
    const deleteAppointments = prisma.appointments.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteAppointments, deleteUsers]);

    await prisma.$disconnect();
  });
});

describe('FindAllClientApointments', () => {
  let service: AppointmentsService;
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
      providers: [AppointmentsService, PrismaService],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    prisma = module.get<PrismaService>(PrismaService);

    client = await prisma.user.create({ data: createClient });
    provider = await prisma.user.create({ data: createProvider });

    await service.create(
      {
        date: new Date(2022, 10, 14, 0, 0),
        provider_id: provider.id,
      },
      client,
    );
    await service.create(
      {
        date: new Date(2022, 11, 14, 0, 0),
        provider_id: provider.id,
      },
      client,
    );
  });

  it('should be defined', async () => {
    expect({ prisma, service, client, provider }).toBeDefined();
  });

  it('Deve retornar um array com todos os agendamentos do usuário corrente ', async () => {
    const appointments = await service.findAllClientAppointments(client);
    expect(typeof appointments).toBe('object');
    expect(typeof appointments[0]).toBe('object');
    expect(appointments.length).toBe(2);
  });

  afterAll(async () => {
    const deleteAppointments = prisma.appointments.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteAppointments, deleteUsers]);

    await prisma.$disconnect();
  });
});

describe('Update', () => {
  let service: AppointmentsService;
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
      providers: [AppointmentsService, PrismaService],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    prisma = module.get<PrismaService>(PrismaService);

    client = await prisma.user.create({ data: createClient });
    provider = await prisma.user.create({ data: createProvider });
  });

  it('should be defined', async () => {
    expect({ prisma, service }).toBeDefined();
  });

  it('Deve retornar erro se o provider for igual ao usuário corrente', async () => {
    const appointment = {
      date: new Date(2022, 10, 14, 0, 0),
      provider_id: provider.id,
    };

    await service.create(appointment, provider).catch((err) => {
      expect(err.response.statusCode).toBe(400);
      expect(err).toBeDefined();
    });
  });

  it('Deve retornar erro se o cliente não existir', async () => {
    const appointment = {
      date: new Date(2022, 10, 16, 0, 0),
      provider_id: provider.id,
    };

    await service
      .create(appointment, { ...client, id: randomUUID() })
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.status).toBe(400);
      });
  });

  it('Deve retornar erro se o provider não existir', async () => {
    const appointment = {
      date: new Date(2022, 10, 16, 0, 0),
      provider_id: randomUUID(),
    };

    await service
      .create(appointment, { ...client, id: randomUUID() })
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.status).toBe(400);
      });
  });

  it('Deve criar o agendamento se o cliente existir', async () => {
    const appointment = {
      date: new Date(2022, 10, 16, 0, 0),
      provider_id: provider.id,
    };

    const res = await service.create(appointment, client);
    expect(res.client_id).toBe(client.id);
    expect(res.provider_id).toBe(provider.id);
  });

  it('Deve retornar erro se o agendamento for duplicado ou no mesmo horário de outro', async () => {
    const appointment = {
      date: new Date(2022, 10, 16, 0, 0),
      provider_id: provider.id,
    };

    await service.create(appointment, client).catch((err) => {
      expect(err).toBeDefined();
      expect(err.status).toBe(400);
    });
  });

  afterAll(async () => {
    const deleteAppointments = prisma.appointments.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteAppointments, deleteUsers]);

    await prisma.$disconnect();
  });
});
