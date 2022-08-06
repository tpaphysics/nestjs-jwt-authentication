import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  Query,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { findAllUserDto } from './dto/findAll-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bycrypt from 'bcrypt';
import FindAllUserResponse from './entities/find-all-users-response.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const { password } = data;

    const hash = await bycrypt.hash(password, 10);

    try {
      return await this.prisma.user.create({
        data: {
          ...data,
          password: hash,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (error.code === 'P2002') {
          throw new NotAcceptableException(
            'A new user cannot be created with this email',
          );
        }
      }
      throw error;
    }
  }

  async findAll(
    query: findAllUserDto,
    currentUser?: User,
  ): Promise<FindAllUserResponse> {
    const { page, take } = query;

    const totalUsers = await this.prisma.user.count();

    if (!totalUsers || totalUsers == 0) {
      throw new InternalServerErrorException('Not found users!');
    }

    if (take > totalUsers) {
      throw new BadRequestException('Invalid number of users!');
    }

    const totalPages = Math.ceil(totalUsers / take);

    if (page > totalPages) {
      throw new BadRequestException(
        `Maximum number of pages are ${totalPages}!`,
      );
    }

    let users;
    if (currentUser) {
      users = await this.prisma.user.findMany({
        skip: (page - 1) * take,
        take,
        orderBy: {
          created_at: 'asc',
        },
        where: {
          NOT: {
            email: {
              equals: currentUser.email,
            },
          },
        },

        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          created_at: true,
          updated_at: true,
        },
      });
    } else {
      users = await this.prisma.user.findMany({
        skip: (page - 1) * take,
        take,
        orderBy: {
          created_at: 'asc',
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          created_at: true,
          updated_at: true,
        },
      });
    }

    return {
      paginate: {
        page: page,
        totalPages,
      },
      users: [...users],
    };
  }

  async findOne(id: string): Promise<User> {
    const uniqueUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!uniqueUser) {
      throw new BadRequestException('User does not exist!');
    }
    return uniqueUser;
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(
    file: Express.Multer.File,
    id: string,
    data: UpdateUserDto,
  ): Promise<User> {
    /*
    const { id: currentUserId } = user;
    if (currentUserId !== id) {
      throw new BadRequestException(
        'The operation cannot be performed. Lamer!',
      );
    }*/
    /*
    const { password } = data;

    if (password) {
      const hash = await bycrypt.hash(password, 10);

      if (!hash) {
        throw new InternalServerErrorException('Problem saving password!');
      }
      data['password'] = hash;
    } */

    return await this.prisma.user.update({
      where: {
        id,
      },
      data: file
        ? {
            ...data,
            avatar: file.filename,
          }
        : data,
    });
  }

  async remove(id: string): Promise<User> {
    const existUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!existUser) {
      throw new ConflictException('User does not exist!');
    }
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
  async findAllProvidersExceptCurrentUser(
    @Query() query: findAllUserDto,
    curentUser: User,
  ): Promise<FindAllUserResponse> {
    return await this.findAll(query, curentUser);
  }
}
