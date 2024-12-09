import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsRepository } from './projects.repository';
import { ProjectQueryDto } from './dto/get-project-query.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectRepository: ProjectsRepository) {}
  async create(createdById: string, createProjectDto: CreateProjectDto) {
    const { startDate } = createProjectDto;

    return await this.projectRepository.create({
      ...createProjectDto,
      startDate: new Date(startDate),
      createdBy: {
        connect: { userId: createdById },
      },
    });
  }

  async findAll(query: ProjectQueryDto) {
    return await this.projectRepository.findAll(query);
  }

  async findOne(projectId: string) {
    return await this.projectRepository.findOne(projectId);
  }

  async update(projectId: string, updateProjectDto: UpdateProjectDto) {
    return await this.projectRepository.update({ projectId }, updateProjectDto);
  }

  async remove(projectId: string) {
    return await this.projectRepository.remove(projectId);
  }
}
