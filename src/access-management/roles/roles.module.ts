import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PrismaService } from 'src/prisma.service';
import { RolesRepository } from './roles.repository';

@Module({
  controllers: [RolesController],
  providers: [PrismaService, RolesService, RolesRepository],
  exports: [RolesService],
})
export class RolesModule {}
