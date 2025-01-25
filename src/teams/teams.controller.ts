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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.teamsService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(+id);
  }
}
