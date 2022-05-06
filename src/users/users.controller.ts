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

@Controller('users')
@ApiTags('CRUD')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: User,
  })
  @IsPublicRoute()
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Find users' })
  @ApiResponse({
    status: 200,
    description: 'The found users',
    type: FindAllUserResponse,
  })
  @Get()
  async findAll(@Query() query: findAllUserDto): Promise<FindAllUserResponse> {
    return await this.usersService.findAll(query);
  }

  @ApiOperation({ summary: 'Find user' })
  @Get(':id')
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
    type: User,
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

  @ApiOperation({ summary: 'Delete user' })
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Update users',
    type: User,
  })
  async remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }
}
