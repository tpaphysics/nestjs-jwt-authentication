import { TestingModule, Test } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../users/entities/user.entity';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';

describe('Create ', () => {
  let controller: AppointmentsController;
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

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [AppointmentsController],
      providers: [AppointmentsService, PrismaService],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    prisma = module.get<PrismaService>(PrismaService);

    client = await prisma.user.create({ data: createClient });
    provider = await prisma.user.create({ data: createProvider });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should be return appointments', async () => {
    const appointment = {
      date: new Date(2022, 10, 14, 0, 0),
      provider_id: provider.id,
    };
    const newAppointment = await controller.create(appointment, client);
    expect(newAppointment).toBeDefined();
    expect(newAppointment.provider_id).toBe(provider.id);
  });

  afterAll(async () => {
    const deleteAppointments = prisma.appointments.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteAppointments, deleteUsers]);

    await prisma.$disconnect();
  });
});

describe('FindAllClientAppointments ', () => {
  let controller: AppointmentsController;
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

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [AppointmentsController],
      providers: [AppointmentsService, PrismaService],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    prisma = module.get<PrismaService>(PrismaService);

    client = await prisma.user.create({ data: createClient });
    provider = await prisma.user.create({ data: createProvider });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should be return client appointments array', async () => {
    await controller.create(
      {
        date: new Date(2022, 10, 14, 0, 0),
        provider_id: provider.id,
      },
      client,
    );

    await controller.create(
      {
        date: new Date(2022, 11, 14, 0, 0),
        provider_id: provider.id,
      },
      client,
    );

    const appointments = await controller.findAllClientAppointments(client);
    console.log(appointments);
    expect(typeof appointments).toBe('object');
    expect(typeof appointments[0]).toBe('object');
    expect(appointments.length).toBe(2);
    expect(appointments[0].client_id).toBe(client.id);
  });

  afterAll(async () => {
    const deleteAppointments = prisma.appointments.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteAppointments, deleteUsers]);

    await prisma.$disconnect();
  });
});
