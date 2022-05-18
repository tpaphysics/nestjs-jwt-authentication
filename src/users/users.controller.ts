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

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import FindAllUserResponse from './entities/find-all-users-response.entity';
import { UpdateUserWithThumbnailDto } from './dto/upload-image-user.dto';

@Controller('users')
@ApiTags('CRUD')
@ApiBearerAuth()
@IsPublicRoute()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @IsPublicRoute()
  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: User,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find users' })
  @ApiResponse({
    status: 200,
    description: 'The found users',
    type: FindAllUserResponse,
  })
  async findAll(@Query() query: findAllUserDto): Promise<FindAllUserResponse> {
    return await this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find user' })
  @ApiResponse({
    status: 200,
    description: 'The found user',
    type: FindAllUserResponse,
  })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'ThubnailUser',
    type: UpdateUserWithThumbnailDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Update user',
    type: User,
  })
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(file, id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 200,
    description: 'Update users',
    type: User,
  })
  async remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }
}
