import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from './users.service';
import * as bycrypt from 'bcrypt';
import { NotAcceptableException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;
  let provider: User;
  let client: User;
  let result;

  const createClient = {
    name: 't',
    email: 't@t.com',
    password: '1',
  };
  const createProvider = {
    name: 'p',
    email: 'p@p.com',
    password: '1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', async () => {
    expect({ prisma, service }).toBeDefined();
  });

  it('should be new user', async () => {
    result = await service.create(createClient);

    console.log(result);
    expect(result).toBeDefined();
  });

  it('O campo password deve ser um hash', async () => {
    console.log(result.password);
    const isMatch = await bycrypt.compare('1', result.password);
    expect(result.password).not.toBe('1');
    expect(isMatch).toBe(true);
  });

  it('Deve retornar erro ao tentar criar um email existente', async () => {
    try {
      const user = await service.create(createClient);
      expect(user).toBe(undefined);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.status).toBe(406);
    }
  });

  afterAll(async () => {
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteUsers]);

    await prisma.$disconnect();
  });
});
