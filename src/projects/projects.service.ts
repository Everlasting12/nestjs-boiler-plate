import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsRepository } from './projects.repository';
import { ProjectQueryDto } from './dto/get-project-query.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectRepository: ProjectsRepository) {}
  async create(createProjectDto: CreateProjectDto) {
    const { createdById, startDate } = createProjectDto;
    delete createProjectDto.createdById;
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

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
