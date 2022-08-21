import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import MulterConfigService from '../multer/multer-config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SetThumbnailUrlAndDeletePasswordInterceptor } from './interceptors/users.interceptor';

@Module({
  exports: [UsersService],
  imports: [
    PrismaModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    /* {
      provide: APP_INTERCEPTOR,
      useClass: SetThumbnailUrlAndDeletePasswordInterceptor,
    },*/
  ],
})
export class UsersModule {}
