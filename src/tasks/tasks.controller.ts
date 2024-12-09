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

@Controller({ path: 'project/:projectId/tasks', version: '1' })
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
  findAll(@Param('projectId') projectId: string, @Query() query: TaskQueryDto) {
    return this.tasksService.findAll(projectId, query);
  }

  @Patch(':taskId/status')
  changeStatus(
    @Param('taskId') taskId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.tasksService.changeStatus(taskId, projectId);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
