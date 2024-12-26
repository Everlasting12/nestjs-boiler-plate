import { Injectable } from '@nestjs/common';
import { UpdateTeamDto } from '../teams/dto/update-team.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { TeamQueryDto } from './dto/get-team-query.dto';

@Injectable()
export class TeamsRepository {
  constructor(private prisma: PrismaService) {}

  async create(createTeamDto: Prisma.TeamCreateInput) {
    return await this.prisma.team.create({
      data: createTeamDto,
    });
  }

  async findAll(query: TeamQueryDto) {
    const { paginate, relation, skip, limit, ...restQuery } = query;
    delete restQuery.isActive;
    if (restQuery?.name) {
      restQuery.name = {
        contains: restQuery.name,
      } as any;
    }
    if (restQuery?.teamLeadId) {
      restQuery.teamLeadId = {
        in: restQuery.teamLeadId,
      } as any;
    }

    const includeRelations = relation
      ? {
          createdBy: {
            select: {
              userId: true,
              email: true,
              name: true,
            },
          },
          // project: {
          //   select: {
          //     projectId: true,
          //     name: true,
          //   },
          // },
          teamLead: {
            select: {
              userId: true,
              email: true,
              name: true,
            },
          },
        }
      : undefined;

    if (!paginate) {
      const data = await this.prisma.team.findMany({
        relationLoadStrategy: 'join',
        where: restQuery as Prisma.TeamWhereInput,
        orderBy: {
          updatedAt: 'desc',
        },
        include: includeRelations,
      });
      return {
        data,
        total: data.length,
      };
    }

    const [total, data] = await Promise.all([
      this.prisma.team.count({
        where: restQuery as Prisma.TeamWhereInput,
      }),
      this.prisma.team.findMany({
        relationLoadStrategy: 'join',
        where: restQuery as Prisma.TeamWhereInput,
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: limit,
        include: includeRelations,
      }),
    ]);

    return {
      total,
      skip,
      limit,
      data,
    };
  }

  async findOne(query: Prisma.TeamWhereUniqueInput) {
    return this.prisma.team.findUnique({
      where: query,
    });
  }
  async findByQuery(query: TeamQueryDto) {
    const { teamLeadId, ...restQuery } = query;

    return this.prisma.team.findFirst({
      where: restQuery,
    });
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
