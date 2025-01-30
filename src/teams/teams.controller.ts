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
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { Public } from '../auth/guards/jwt-auth.guard';
import { TeamQueryDto } from './dto/get-team-query.dto';
import { Request } from 'express';
import { UpdateTeamDto } from './dto/update-team.dto';

@Controller({ path: 'teams', version: '1' })
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Req() req: Request, @Body() createTeamDto: CreateTeamDto) {
    const createdById = req['userId'];
    return this.teamsService.create(createdById, createTeamDto);
  }

  @Public()
  @Get()
  findAll(@Query() query: TeamQueryDto) {
    return this.teamsService.findAll(query);
  }

  @Get(':teamId/assistants')
  findTeamLeadAssistants(@Param('teamId') id: string) {
    return this.teamsService.findTeamLeadAssistants(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Patch(':teamId')
  update(@Param('teamId') teamId: string, @Body() body: UpdateTeamDto) {
    return this.teamsService.update(teamId, body);
  }

  @Delete(':teamId')
  remove(@Param('teamId') teamId: string) {
    return this.teamsService.remove(teamId);
  }
}
