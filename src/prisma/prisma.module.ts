import { Module } from '@nestjs/common';
import { PrismaTestService } from './prisma-test.service';
import { PrismaService } from './prisma.service';

@Module({
  exports: [PrismaModule],
  providers: [PrismaService, PrismaTestService],
})
export class PrismaModule {}
