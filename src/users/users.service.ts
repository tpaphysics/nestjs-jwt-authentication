import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateUserDto): Promise<User> {
    const newUser = this.prisma.user.create({
      data,
    });
    if (!newUser) {
      throw new NotFoundException('Not possible');
    }
    return newUser;
  }
  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
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
