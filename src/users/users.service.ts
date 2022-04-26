import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { findAllUserDto } from './dto/findAll-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FindAllUserResponse } from './interfaces/user.interfaces';
import * as bycrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const { password } = data;
    const hash = await bycrypt.hash(password, 10);

    if (!hash) {
      throw new InternalServerErrorException('Problem saving password!');
    }
    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        password: await hash,
      },
    });
    return {
      ...newUser,
      password: undefined,
    };
  }

  async findAll(query: findAllUserDto): Promise<FindAllUserResponse> {
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

    const users = await this.prisma.user.findMany({
      skip: (page - 1) * take,
      take,
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        gender: true,
        avatarFileName: true,
        password: false,
        createdAt: true,
        updateAt: true,
      },
    });

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
      throw new BadRequestException('"User does not exist!');
    }
    return {
      ...uniqueUser,
      password: undefined,
    };
  }

  async findByEmail(email: string): Promise<User> {
    const oneUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return {
      ...oneUser,
      password: undefined,
    };
  }

  async update(
    file: Express.Multer.File,
    id: string,
    data: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: file
        ? {
            ...data,
            avatarFileName: file.filename,
          }
        : data,
    });
    const { avatarFileName } = updatedUser;
    return {
      ...updatedUser,
      avatarFileName: `${process.env.AVATAR_USER_HOST}/${avatarFileName}`,
      password: undefined,
    };
  }

  async remove(id: string): Promise<User> {
    const removedUser = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return {
      ...removedUser,
      password: undefined,
    };
  }
}
