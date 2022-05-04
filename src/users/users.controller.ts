import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { findAllUserDto } from './dto/findAll-user.dto';
import { IsPublicRoute } from 'src/auth/decorators/is-public-route.decorator';
import { User } from './entities/user.entity';
import { FindAllUserResponse } from './interfaces/user.interfaces';

import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { updateUserWithThumbnailDto } from './dto/upload-image-user.dto';

@IsPublicRoute()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiTags('create new user')
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @ApiTags('find users paginate')
  @Get()
  async findAll(@Query() query: findAllUserDto): Promise<FindAllUserResponse> {
    return await this.usersService.findAll(query);
  }

  @ApiTags('find user')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @ApiTags('update user')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'ThubnailUser',
    type: updateUserWithThumbnailDto,
  })
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(file, id, updateUserDto);
  }

  @ApiTags('delete user')
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }
}
