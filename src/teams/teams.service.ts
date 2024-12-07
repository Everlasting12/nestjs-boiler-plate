import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamQueryDto } from './dto/get-team-query.dto';
import { TeamsRepository } from './teams.repository';

@Injectable()
export class TeamsService {
  constructor(private readonly teamRepository: TeamsRepository) {}

  async create(createTeamDto: CreateTeamDto) {
    const { createdById, teamLeadId, projectId } = createTeamDto;
    return await this.teamRepository.create({
      ...createTeamDto,
      createdBy: {
        connect: { userId: createdById },
      },
      teamLead: {
        connect: { userId: teamLeadId },
      },
      project: {
        connect: { projectId: projectId },
      },
    });
  }

  async findAll(query: TeamQueryDto) {
    return await this.teamRepository.findAll(query);
  }

  findOne(id: number) {
    return `This action returns a #${id} team`;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
