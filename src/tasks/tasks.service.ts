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
import { Prisma, User, UserRole } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { ROLES } from 'libs/common/application-constant';
import { UserRolesService } from 'src/access-management/user-roles/user-roles.service';
import { UpdateUserRoleDto } from 'src/access-management/user-roles/dto/update-user-role.dto';
import { LoggerService } from '../../libs/common/logger/logger.service';
@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepository: TasksRepository,

    @Inject(forwardRef(() => TeamsService))
    private readonly teamService: TeamsService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    @Inject(forwardRef(() => UserRolesService))
    private readonly userRolesService: UserRolesService,
  ) {}

  private readonly logger = new LoggerService();

  async create(
    createdById: string,
    projectId: string,
    createTaskDto: CreateTaskDto,
  ) {
    const { assignedToId, dueDate } = createTaskDto;
    delete createTaskDto.createdById;
    delete createTaskDto.assignedToId;

    const newTask = await this.taskRepository.create({
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

    this.checkIfNewProjectAssignedForTask(projectId, assignedToId);

    return newTask;
  }

  async findAll(
    projectId: string,
    query: TaskQueryDto,
    user: User & { userRole?: UserRole[] },
  ) {
    const { permissionEntities, roleId } = user?.userRole?.at(0);

    if (projectId && !['null', 'undefined', 'false', '*'].includes(projectId)) {
      query.projectId = [projectId];
    } else if (query.projectId?.length) {
      query.projectId = query.projectId;
    } else if (
      permissionEntities?.['projectId'] &&
      permissionEntities?.['projectId']?.[0] !== '*'
    ) {
      query.projectId = permissionEntities?.['projectId'];
    } else {
      delete query.projectId;
    }

    if (roleId === ROLES.DIRECTOR) {
      delete query.assignedToId;
      delete query.createdById;
    } else if (roleId === ROLES.TEAM_LEAD) {
      const teams = await this.teamService.findAll({
        teamLeadId: [user.userId],
      });

      if (teams?.total) {
        const teamMembers = teams.data.flatMap((team) => team.members);
        if (teamMembers?.length) {
          query.assignedToId = [...teamMembers, user.userId];
          query.createdById = [...teamMembers, user.userId];
        }
      }
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
      ...(projectId && projectId !== 'undefined' && { projectId: [projectId] }),
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

  async fetchMembers(user: User & { userRole?: UserRole[] }) {
    const { roleId } = user?.userRole?.at(0);
    const members = { data: [], total: 0 };

    if (roleId === ROLES.DIRECTOR) {
      const users = await this.userService.findAll({
        paginate: false,
        relation: true,
      });
      members.data =
        users?.data?.map((u) => ({
          name: u.name,
          email: u.email,
          userId: u.userId,
          role: u.userRole?.at(0)?.['role']?.['name'],
        })) ?? [];
      members.total = users.total;
      return members;
    } else if (roleId === ROLES.TEAM_LEAD) {
      const teams = await this.teamService.findAll({
        teamLeadId: [user.userId],
      });

      if (teams?.total) {
        const teamMembers = teams.data.flatMap((team) => team.members);
        const users = await this.userService.findAll({
          userIds: [...teamMembers, user.userId],
          paginate: false,
          relation: true,
        });

        members.data =
          users?.data?.map((u) => ({
            name: u.name,
            email: u.email,
            userId: u.userId,
            role: u.userRole?.at(0)?.['role']?.['name'],
          })) ?? [];
        members.total = users.total;
        return members;
      }
    }
    return {
      data: [
        {
          name: user.name,
          userId: user.userId,
          email: user.email,
          role: roleId,
        },
      ],
      total: 1,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }

  async checkIfNewProjectAssignedForTask(
    projectId: string,
    assignedToId: string,
  ) {
    const { data } = await this.userRolesService.findOne({
      userId: [assignedToId],
    });
    if (
      data?.permissionEntities?.['projectId'] &&
      !data?.permissionEntities?.['projectId']?.includes(projectId)
    ) {
      // update this permissionEntities with new projectId
      const updatedEntity = {
        ...(data?.permissionEntities as object),
        projectId: [...data?.permissionEntities?.['projectId'], projectId],
      };

      const dto = new UpdateUserRoleDto();
      dto.permissionEntities = updatedEntity;
      this.logger.debug(
        `checkIfNewProjectAssignedForTask:${JSON.stringify(dto)} `,
      );
      this.userRolesService.update(data.id, dto);
    }
  }
}
