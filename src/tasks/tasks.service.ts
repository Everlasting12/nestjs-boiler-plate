import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/get-tasks-query.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TasksRepository) {}

  async create(projectId: string, createTaskDto: CreateTaskDto) {
    const { assignedTo, createdById } = createTaskDto;
    delete createTaskDto.createdById;
    return await this.taskRepository.create({
      ...createTaskDto,
      project: {
        connect: { projectId }, // Link the project using the projectId
      },
      assignedTo: {
        connect: { userId: assignedTo }, // Link the assigned user using assignedTo
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
