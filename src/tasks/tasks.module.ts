import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TasksController],
  providers: [PrismaService, TasksService, TasksRepository],
})
export class TasksModule {}
