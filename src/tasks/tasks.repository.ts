import { Injectable } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
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

  async findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    console.log(' TasksRepository ~ update ~ updateTaskDto:', updateTaskDto);
    return `This action updates a #${id} task`;
  }

  async remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
