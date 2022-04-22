import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginateUserQueryDto } from './dto/paginate-user-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }

  async findAll(query: PaginateUserQueryDto): Promise<any> {
    const { page, take } = query;

    const totalUsers = await this.prisma.user.count();
    const totalPages = Math.trunc(totalUsers / take);

    const users = await this.prisma.user.findMany({
      skip: (page - 1) * take,
      take,
      orderBy: {
        createdAs: 'asc',
      },
    });
    if (page > totalPages) {
      throw new BadRequestException(
        `Maximum number of pages are ${totalPages}`,
      );
    }
    return {
      paginate: {
        page: page,
        totalPages,
      },
      ...users,
    };
  }

  findOne(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
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
    };
  }

  remove(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
