import { Module } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { UserRolesController } from './user-roles.controller';
import { UserRolesRepository } from './user-roles.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [UserRolesController],
  providers: [PrismaService, UserRolesService, UserRolesRepository],
  exports: [UserRolesService],
})
export class UserRolesModule {}
