import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamQueryDto } from './dto/get-team-query.dto';
import { TeamsRepository } from './teams.repository';
import { UsersService } from 'src/users/users.service';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    private readonly teamRepository: TeamsRepository,
    private readonly userService: UsersService,
  ) {}

  async create(createdById: string, createTeamDto: CreateTeamDto) {
    const { teamLeadId } = createTeamDto;
    delete createTeamDto.teamLeadId;
    return await this.teamRepository.create({
      ...createTeamDto,
      createdBy: {
        connect: { userId: createdById },
      },
      teamLead: {
        connect: { userId: teamLeadId },
      },
    });
  }

  async findAll(query: TeamQueryDto) {
    return await this.teamRepository.findAll(query);
  }

  async findTeamLeadAssistants(teamId: string) {
    const team = await this.teamRepository.findOne({ id: teamId });

    if (team?.assistantTeamLeadIds?.length) {
      return await this.userService.findAll({
        paginate: false,
        userIds: team?.assistantTeamLeadIds,
        select: ['userId', 'name', 'email'],
      });
    } else {
      return [];
    }
  }
  findOne(teamId: string) {
    return this.teamRepository.findOne({ id: teamId });
  }

  async findByQuery(query: TeamQueryDto) {
    return await this.teamRepository.findByQuery(query);
  }

  async update(id: string, body: UpdateTeamDto) {
    return await this.teamRepository.update({ id }, body);
  }

  remove(id: string) {
    return `This action removes a #${id} team`;
  }
}
