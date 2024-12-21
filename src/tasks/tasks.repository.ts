import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { TaskQueryDto } from './dto/get-tasks-query.dto';

@Injectable()
export class TasksRepository {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: Prisma.TaskCreateInput) {
    return await this.prisma.task.create({
      data: createTaskDto,
    });
  }

  async findAll(query: TaskQueryDto) {
    const { paginate, relation, skip, limit, ...restQuery } = query;

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
    if (restQuery.createdById) {
      restQuery.createdById = { equals: restQuery.createdById } as any;
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
    const { relation, ...resQuery } = query;
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
        }
      : undefined;

    return await this.prisma.task.findUnique({
      where: resQuery as Prisma.TaskWhereUniqueInput,
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
