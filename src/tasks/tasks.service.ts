import {
  BadRequestException,
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
import { RolesService } from 'src/access-management/roles/roles.service';
@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepository: TasksRepository,
    private readonly teamService: TeamsService,
    private readonly userService: UsersService,
    private readonly userRolesService: UserRolesService,
    private readonly rolesService: RolesService,
  ) {}

  private readonly logger = new LoggerService();

  async create(
    createdById: string,
    projectId: string,
    createTaskDto: CreateTaskDto,
  ) {
    const { assignedToId, dueDate, teamId } = createTaskDto;
    delete createTaskDto.createdById;
    delete createTaskDto.assignedToId;
    delete createTaskDto.teamId;

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
      team: {
        connect: { id: teamId }, // Link the creator using createdBy
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
    }

    let teamIds = [];
    if (roleId === ROLES.TEAM_LEAD) {
      const teams = await this.teamService.findAll({
        teamLeadId: [user.userId],
      });
      if (teams?.total) {
        teamIds = teams.data.map((team) => team.id);
      }
    }

    return await this.taskRepository.findAll(query, teamIds);
  }
  async findAllApproval(
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
    }

    let teamIds = [];
    let directorIds = [];
    if (roleId === ROLES.TEAM_LEAD) {
      const teams = await this.teamService.findAll({
        paginate: false,
        teamLeadId: [user.userId],
      });
      if (teams?.total) {
        teamIds = teams.data.map((team) => team.id);
      }

      const directors = await this.userRolesService.findAll({
        paginate: false,
        roleId: [ROLES.DIRECTOR],
      });

      if (directors?.total) {
        directorIds = directors?.data?.map((director) => director.userId);
      }
    }
    if (roleId === ROLES.ASSISTANT_TEAM_LEAD) {
      const teams = await this.teamService.findAll({
        paginate: false,
        assistantTeamLeadIds: [user.userId],
      });

      if (teams?.total) {
        teamIds = teams.data.map((team) => team.id);
      }

      const directors = await this.userRolesService.findAll({
        paginate: false,
        roleId: [ROLES.DIRECTOR],
      });

      if (directors?.total) {
        directorIds = directors?.data?.map((director) => director.userId);
      }
    }

    return await this.taskRepository.findAllApproval(
      query,
      user,
      teamIds,
      directorIds,
    );
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

    const role = await this.rolesService.findOne(roleId);

    const query = {
      roleId: [],
      paginate: false,
      relation: true,
    };

    const users = {
      data: [
        {
          name: user.name,
          userId: user.userId,
          email: user.email,
          role: role.name,
        },
      ],
      total: 1,
    };

    switch (roleId) {
      case ROLES.DIRECTOR:
        users.data = [];
        users.total = 0;
        query.roleId = Object.values(ROLES);
        break;

      case ROLES.TEAM_LEAD:
        query.roleId = Object.values(ROLES).filter(
          (role) => ![ROLES.DIRECTOR, ROLES.TEAM_LEAD].includes(role),
        );
        break;
      case ROLES.ASSISTANT_TEAM_LEAD:
        query.roleId = Object.values(ROLES).filter(
          (role) => ![ROLES.DIRECTOR, ROLES.TEAM_LEAD].includes(role),
        );
        break;
      case ROLES.ARCHITECT:
        query.roleId = Object.values(ROLES).filter((role) =>
          [ROLES.INTERN].includes(role),
        );
        break;
      case ROLES.DRAUGHTSMAN:
        query.roleId = Object.values(ROLES).filter((role) =>
          [ROLES.INTERN].includes(role),
        );
        break;
      case ROLES.INTERN:
        break;

      default:
        break;
    }

    if (query?.roleId?.length) {
      const userRoles = await this.userRolesService.findAll(query);
      if (userRoles?.total) {
        users.data.push(
          ...userRoles.data.map((userRole) => ({
            name: userRole?.['user']?.['name'],
            email: userRole?.['user']?.['email'],
            userId: userRole?.['user']?.['userId'],
            role: userRole?.['role']?.['name'],
          })),
        );

        users.total = userRoles.total + users.total;
      }
    }

    return users;
  }

  async remove(taskId: string, projectId: string) {
    return await this.taskRepository.remove({ taskId, projectId });
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
