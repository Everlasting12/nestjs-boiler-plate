import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, User, UserRole } from '@prisma/client';
import { TaskQueryDto } from './dto/get-tasks-query.dto';

@Injectable()
export class TasksRepository {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: Prisma.TaskCreateInput) {
    return await this.prisma.task.create({
      data: createTaskDto,
    });
  }

  async findAll(query: TaskQueryDto, teamIds?: string[]) {
    const { paginate, relation, skip, limit, accessLevel, ...restQuery } =
      query;

    if (restQuery.status) {
      restQuery.status = {
        in: restQuery.status,
      } as any;
    }
    if (restQuery.priority) {
      restQuery.priority = {
        in: restQuery.priority,
      } as any;
    }

    if (restQuery.projectId) {
      restQuery.projectId = {
        in: restQuery.projectId,
      } as any;
    }
    if (restQuery.teamId) {
      restQuery.teamId = {
        in: restQuery.teamId,
      } as any;
    }
    if (restQuery?.createdAt) {
      restQuery.createdAt = {
        gte: new Date(restQuery?.createdAt?.startDate),
        lte: new Date(restQuery?.createdAt?.endDate),
      } as any;
    } else {
      delete restQuery.createdAt;
    }

    if (restQuery.createdById) {
      if (accessLevel) {
        restQuery['OR'] = [
          { assignedToId: { in: restQuery.assignedToId } },
          { createdById: { in: restQuery.createdById } },
        ];
        delete restQuery.assignedToId;
        delete restQuery.createdById;
      } else {
        restQuery.createdById = { in: restQuery.createdById } as any;
        restQuery.assignedToId = { in: restQuery.assignedToId } as any;
      }
    }

    if (teamIds?.length) {
      restQuery['OR'] = [
        ...restQuery['OR'],
        {
          teamId: { in: teamIds },
        },
      ];
    }

    const includeRelations = relation
      ? {
          assignedTo: {
            select: {
              userId: true,
              email: true,
              name: true,
            },
          },
          createdBy: {
            select: {
              userId: true,
              email: true,
              name: true,
            },
          },
          project: {
            select: {
              name: true,
              category: true,
              clientEmailId: true,
            },
          },
        }
      : undefined;

    if (!paginate) {
      const data = await this.prisma.task.findMany({
        relationLoadStrategy: 'join',
        where: restQuery as Prisma.TaskWhereInput,
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
      this.prisma.task.count({
        where: restQuery as Prisma.TaskWhereInput,
      }),
      this.prisma.task.findMany({
        relationLoadStrategy: 'join',
        where: restQuery as Prisma.TaskWhereInput,
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
  async findAllApproval(
    query: TaskQueryDto,
    user: User & { userRole?: UserRole[] },
    teamIds?: string[],
    directorIds?: string[],
  ) {
    const { paginate, relation, skip, limit, accessLevel, ...restQuery } =
      query;

    if (restQuery.status) {
      restQuery.status = {
        in: restQuery.status,
      } as any;
    }

    if (restQuery.createdById) {
      if (accessLevel) {
        restQuery['OR'] = [
          { assignedToId: { notIn: [...directorIds, user.userId] } },
          // { assignedToId: { in: restQuery.assignedToId } },
          { createdById: { in: restQuery.createdById } },
        ];
        delete restQuery.assignedToId;
        delete restQuery.createdById;
      } else {
        restQuery.createdById = { in: restQuery.createdById } as any;
        restQuery.assignedToId = {
          notIn: [...directorIds, user.userId],
        } as any;
        // restQuery.assignedToId = { in: restQuery.assignedToId } as any;
      }
    }

    // if (teamIds?.length) {
    //   restQuery['OR'] = [
    //     ...restQuery['OR'],
    //     {
    //       teamId: { in: teamIds },
    //     },
    //   ];
    // }

    if (teamIds?.length) {
      restQuery.teamId = {
        in: teamIds,
      } as any;
    }

    const includeRelations = relation
      ? {
          assignedTo: {
            select: {
              userId: true,
              email: true,
              name: true,
            },
          },
          createdBy: {
            select: {
              userId: true,
              email: true,
              name: true,
            },
          },
          project: {
            select: {
              name: true,
              category: true,
              clientEmailId: true,
            },
          },
        }
      : undefined;

    if (!paginate) {
      const data = await this.prisma.task.findMany({
        relationLoadStrategy: 'join',
        where: restQuery as Prisma.TaskWhereInput,
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
      this.prisma.task.count({
        where: restQuery as Prisma.TaskWhereInput,
      }),
      this.prisma.task.findMany({
        relationLoadStrategy: 'join',
        where: restQuery as Prisma.TaskWhereInput,
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

  async findOne(query: TaskQueryDto) {
    const { relation, ...restQuery } = query;

    if (restQuery.projectId) {
      restQuery.projectId = {
        in: restQuery.projectId,
      } as any;
    }
    const includeRelations = relation
      ? {
          assignedTo: {
            select: {
              userId: true,
              email: true,
              name: true,
            },
          },
          createdBy: {
            select: {
              userId: true,
              email: true,
              name: true,
            },
          },
          project: {
            select: {
              name: true,
              category: true,
            },
          },
          team: {
            select: {
              name: true,
            },
          },
        }
      : undefined;

    return await this.prisma.task.findUnique({
      where: restQuery as Prisma.TaskWhereUniqueInput,
      include: includeRelations,
    });
  }

  async update(
    updateQuery: Prisma.TaskWhereUniqueInput,
    updateTaskDto: Prisma.TaskUpdateInput,
  ) {
    return await this.prisma.task.update({
      where: updateQuery,
      data: updateTaskDto,
    });
  }

  async remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
