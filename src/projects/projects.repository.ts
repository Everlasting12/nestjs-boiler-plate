import { Injectable } from '@nestjs/common';
import { UpdateProjectDto } from './dto/update-project.dto';
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
    const { paginate, relation, skip, limit, ...restQuery } = query;

    if (restQuery.name) {
      restQuery.name = {
        contains: restQuery.name,
      } as any;
    }
    if (restQuery.status) {
      restQuery.status = {
        in: restQuery.status,
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
      this.prisma.project.count({
        where: restQuery as Prisma.ProjectWhereInput,
      }),
      this.prisma.project.findMany({
        relationLoadStrategy: 'join',
        where: restQuery as Prisma.ProjectWhereInput,
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
