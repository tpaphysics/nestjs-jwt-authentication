import faker from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProvidersService } from './providers.service';

describe('ProvidersService', () => {
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, ProvidersService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', async () => {
    expect({ prisma }).toBeDefined();
  });
  it('should be defined', () => {
    prisma.user.findMany = jest.fn().mockReturnValueOnce([
      { id: 1, name: 'developer' },
      { id: 2, name: 'developer' },
      { id: 3, name: 'developer' },
    ]);
  });

  const teste = prisma.appointments.findMany;
});
