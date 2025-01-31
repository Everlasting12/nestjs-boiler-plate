import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/get-tasks-query.dto';
import { User } from '@prisma/client';

@Controller({ path: 'projects/:projectId/tasks', version: '1' })
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Req() req: Request,
    @Param('projectId') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const createdById = req['userId'];
    return this.tasksService.create(createdById, projectId, createTaskDto);
  }

  @Get()
  findAll(
    @Param('projectId') projectId: string,
    @Query() query: TaskQueryDto,
    @Req() req: Request & { user: User },
  ) {
    return this.tasksService.findAll(projectId, query, req.user);
  }

  @Get('approvals')
  findAllApproval(
    @Param('projectId') projectId: string,
    @Query() query: TaskQueryDto,
    @Req() req: Request & { user: User },
  ) {
    query.createdById = [req.user.userId];
    query.assignedToId = [req.user.userId];
    return this.tasksService.findAllApproval(projectId, query, req.user);
  }

  @Get('members')
  findMembers(@Req() req: Request & { user: User }) {
    return this.tasksService.fetchMembers(req.user);
  }

  @Get(':taskId')
  findOne(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Query() query: TaskQueryDto,
  ) {
    return this.tasksService.findOne(taskId, projectId, query);
  }

  @Patch(':taskId')
  update(
    @Param('taskId') taskId: string,
    @Param('projectId') projectId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(taskId, projectId, updateTaskDto);
  }

  @Delete(':taskId')
  remove(
    @Param('taskId') taskId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.tasksService.remove(taskId, projectId);
  }
}
