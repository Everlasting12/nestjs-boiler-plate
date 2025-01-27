import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { ProjectQueryDto } from './dto/get-project-query.dto';

@Injectable()
export class ProjectsRepository {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: Prisma.ProjectCreateInput) {
    return await this.prisma.project.create({
      data: createProjectDto,
    });
  }

  async findAll(query: ProjectQueryDto) {
    const { paginate, select, relation, skip, limit, ...restQuery } = query;

    if (restQuery.name) {
      restQuery.name = {
        contains: restQuery.name,
        mode: 'insensitive',
      } as any;
    }
    if (restQuery.status) {
      restQuery.status = {
        in: restQuery.status,
      } as any;
    }
    if (restQuery.projectId) {
      restQuery.projectId = {
        in: restQuery.projectId,
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
        }
      : undefined;

    if (!paginate) {
      const data = await this.prisma.project.findMany({
        relationLoadStrategy: 'join',
        where: restQuery as Prisma.ProjectWhereInput,
        orderBy: [
          {
            name: 'asc',
          },
        ],
        include: includeRelations,
        ...(select?.length
          ? { select: Object.fromEntries(select.map((field) => [field, true])) }
          : {}),
      });
      return {
        data,
        total: data.length,
      };
    }

    const [total, data] = await Promise.all([
      this.prisma.project.count({
        where: restQuery as Prisma.ProjectWhereInput,
      }),
      this.prisma.project.findMany({
        relationLoadStrategy: 'join',
        where: restQuery as Prisma.ProjectWhereInput,
        orderBy: [
          {
            name: 'asc',
          },
        ],
        skip,
        take: limit,
        include: includeRelations,
        ...(select?.length
          ? { select: Object.fromEntries(select.map((field) => [field, true])) }
          : {}),
      }),
    ]);

    return {
      total,
      skip,
      limit,
      data,
    };
  }

  async findOne(projectId: string) {
    return `This action returns a #${projectId} project`;
  }

  async update(
    query: Prisma.ProjectWhereUniqueInput,
    updateProjectDto: Prisma.ProjectUpdateInput,
  ) {
    return await this.prisma.project.update({
      where: query,
      data: updateProjectDto,
    });
  }

  async remove(projectId: string) {
    return `This action removes a #${projectId} project`;
  }
}
