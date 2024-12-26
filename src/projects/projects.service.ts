import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsRepository } from './projects.repository';
import { ProjectQueryDto } from './dto/get-project-query.dto';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectRepository: ProjectsRepository) {}
  async create(createdById: string, _createProjectDto: CreateProjectDto) {
    const { startDate, teamLeadId, ...createProjectDto } = _createProjectDto;

    return await this.projectRepository.create({
      ...createProjectDto,
      startDate: new Date(startDate),
      createdBy: {
        connect: { userId: createdById },
      },
      teamLead: {
        connect: { userId: teamLeadId },
      },
    });
  }

  async findAll(
    query: ProjectQueryDto,
    user: User & { userRole?: UserRole[] },
  ) {
    const { permissionEntities } = user?.userRole?.at(0);

    if (
      permissionEntities?.['projectId'] &&
      permissionEntities?.['projectId']?.[0] !== '*'
    ) {
      query.projectId = permissionEntities?.['projectId'];
    }
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
