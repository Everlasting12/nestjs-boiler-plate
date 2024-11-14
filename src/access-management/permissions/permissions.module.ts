import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PermissionsRepository } from './permissions.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PermissionsController],
  providers: [PrismaService, PermissionsService, PermissionsRepository],
  exports: [PermissionsService],
})
export class PermissionsModule {}
