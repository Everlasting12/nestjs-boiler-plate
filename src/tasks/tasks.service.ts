import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/get-tasks-query.dto';
import { TasksRepository } from './tasks.repository';
import { TeamsService } from '../teams/teams.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepository: TasksRepository,

    @Inject(forwardRef(() => TeamsService))
    private readonly teamService: TeamsService,
  ) {}

  async create(
    createdById: string,
    projectId: string,
    createTaskDto: CreateTaskDto,
  ) {
    const { assignedToId } = createTaskDto;
    delete createTaskDto.createdById;
    delete createTaskDto.assignedToId;
    console.log('🚀 ~ TasksService ~ createTaskDto:', createTaskDto);
    return await this.taskRepository.create({
      ...createTaskDto,
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
    if (projectId && !['null', 'undefined', 'false'].includes(projectId)) {
      query.projectId = projectId;
    }
    return await this.taskRepository.findAll(query);
  }

  async changeStatus(taskId: string, projectId: string) {
    const team = await this.teamService.findByQuery({ projectId });
    console.log('🚀 ~ TasksService ~ changeStatus ~ team:', team);
    // send email api
    return `This action returns a #${taskId} task`;
  }
  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
