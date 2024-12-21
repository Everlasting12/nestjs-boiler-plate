import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Action, UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/get-tasks-query.dto';
import { TasksRepository } from './tasks.repository';
import { TeamsService } from '../teams/teams.service';
import { v4 as uuidv4 } from 'uuid';
import { Prisma, User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepository: TasksRepository,

    @Inject(forwardRef(() => TeamsService))
    private readonly teamService: TeamsService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async create(
    createdById: string,
    projectId: string,
    createTaskDto: CreateTaskDto,
  ) {
    const { assignedToId, dueDate } = createTaskDto;
    delete createTaskDto.createdById;
    delete createTaskDto.assignedToId;

    return await this.taskRepository.create({
      ...createTaskDto,
      dueDate: new Date(dueDate),
      project: {
        connect: { projectId }, // Link the project using the projectId
      },
      assignedTo: {
        connect: { userId: assignedToId }, // Link the assigned user using assignedTo
      },
      createdBy: {
        connect: { userId: createdById }, // Link the creator using createdBy
      },
    });
  }

  async findAll(projectId: string, query: TaskQueryDto) {
    if (projectId && ['null', 'undefined', 'false', '*'].includes(projectId)) {
      delete query.projectId;
    } else {
      query.projectId = projectId;
    }
    return await this.taskRepository.findAll(query);
  }

  async changeStatus(taskId: string, projectId: string) {
    // const team = await this.teamService.findByQuery({ projectId });

    return `This action returns a #${taskId} ${projectId} task`;
  }
  async findOne(taskId: string, projectId: string, _query: TaskQueryDto) {
    const query = {
      ..._query,
      taskId,
      ...(projectId && projectId !== 'undefined' && { projectId }),
    };
    const task = await this.taskRepository.findOne(query);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task?.history && Array.isArray(task?.history)) {
      const userMap = new Map<string, Partial<User>>();

      const userIds = Array.from(
        new Set(task.history.map((hist) => hist['details']['userId'])),
      );

      if (userIds?.length) {
        const users = await this.userService.findAll({
          paginate: false,
          select: ['name', 'userId', 'email'],
        });

        if (users?.total) {
          users.data.forEach((user) => {
            userMap.set(user.userId, user);
          });
          task.history = task.history.map((hist) => {
            return {
              ...(hist as object),
              updatedBy: userMap.get(hist['details']['userId']),
            };
          }) as unknown as Prisma.JsonValue;
        }
      }
    }
    return task;
  }

  async update(
    taskId: string,
    projectId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.findOne(taskId, projectId, { isActive: true });

    if (!task) {
      throw new BadRequestException('Task not found');
    }

    const { action } = updateTaskDto;
    if (action && Object.keys(action)?.length) {
      updateTaskDto.action.createdAt = new Date();
      updateTaskDto.action.id = uuidv4();

      const newAction = updateTaskDto.action;
      updateTaskDto.history = (Array.isArray(
        task.history as unknown as Action[],
      )
        ? [...(task.history as unknown as Action[]), newAction]
        : [newAction]) as unknown as Prisma.JsonValue;

      delete updateTaskDto.action;
    }

    const updateQuery = {
      taskId,
      ...(projectId && projectId !== 'undefined' && { projectId }),
    };

    const updatedTask = await this.taskRepository.update(
      updateQuery,
      updateTaskDto,
    );
    return updatedTask;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
