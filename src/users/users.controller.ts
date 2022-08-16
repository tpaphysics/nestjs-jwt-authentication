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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsPublicRoute } from '../auth/decorators/is-public-route.decorator';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
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
  //@ApiResponse({
  //  status: 200,
  //  description: 'The found users',
  //  type: FindAllUserResponse,
  //})
  async findAll(@Query() query: findAllUserDto): Promise<any> {
    return await this.usersService.findAll(query);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'ThubnailUser',
    type: UpdateUserWithThumbnailDto,
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
  async remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }

  @Get('month')
  async findAllProvidersExceptCurrentUser(
    @Query() query: findAllUserDto,
    @CurrentUser() user: User,
  ): Promise<FindAllUserResponse> {
    console.log(user);
    return await this.usersService.findAllProvidersExceptCurrentUser(
      query,
      user,
    );
  }
  @Get('me')
  @ApiOperation({ summary: 'Find user' })
  async curentUser(@CurrentUser() user: User): Promise<User> {
    return await user;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find user' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }
}
