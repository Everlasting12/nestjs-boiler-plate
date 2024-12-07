import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaService } from 'src/prisma.service';
import { ProjectsRepository } from './projects.repository';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService, ProjectsRepository],
})
export class ProjectsModule {}
