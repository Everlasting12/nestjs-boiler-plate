import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/get-tasks-query.dto';
import { Public } from '../auth/guards/jwt-auth.guard';

@Controller({ path: 'project/:projectId/tasks', version: '1' })
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Public()
  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(projectId, createTaskDto);
  }

  @Public()
  @Get()
  findAll(@Param('projectId') projectId: string, @Query() query: TaskQueryDto) {
    return this.tasksService.findAll(projectId, query);
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
