import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  exports: [PrismaModule, PrismaService],
  providers: [PrismaService],
})
export class PrismaModule {}
