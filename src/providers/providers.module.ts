import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
  exports: [ProvidersService, PrismaModule],
  controllers: [ProvidersController],
  imports: [PrismaModule, UsersModule],
  providers: [ProvidersService],
})
export class ProvidersModule {}
