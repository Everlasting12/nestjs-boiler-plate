import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamQueryDto } from './dto/get-team-query.dto';
import { TeamsRepository } from './teams.repository';
import { UsersService } from 'src/users/users.service';

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

  findOne(teamId: string) {
    return this.teamRepository.findOne({ id: teamId });
  }

  async findByQuery(query: TeamQueryDto) {
    return await this.teamRepository.findByQuery(query);
  }

  update(id: number) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
