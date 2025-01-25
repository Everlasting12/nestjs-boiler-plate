import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { PrismaService } from 'src/prisma.service';
import { TeamsModule } from '../teams/teams.module';
import { UsersModule } from 'src/users/users.module';
import { UserRolesModule } from 'src/access-management/user-roles/user-roles.module';
import { RolesModule } from 'src/access-management/roles/roles.module';

@Module({
  imports: [TeamsModule, UsersModule, RolesModule, UserRolesModule],
  controllers: [TasksController],
  providers: [PrismaService, TasksService, TasksRepository],
})
export class TasksModule {}
