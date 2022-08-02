import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  exports: [ProvidersService, PrismaModule],
  controllers: [ProvidersController],
  imports: [PrismaModule],
  providers: [ProvidersService],
})
export class ProvidersModule {}
