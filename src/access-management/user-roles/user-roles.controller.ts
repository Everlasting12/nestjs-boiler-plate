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
import { UserRolesService } from './user-roles.service';
import {
  CreateBulkUserRolesDto,
  CreateUserRoleDto,
} from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRoleQueryDto } from './dto/get-user-role-query.dto';
import { Request } from 'express';

@Controller({ path: 'user-roles', version: '1' })
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Post()
  create(@Body() createUserRoleDto: CreateUserRoleDto) {
    return this.userRolesService.create(createUserRoleDto);
  }

  @Post('bulk')
  createBulk(@Body() createUserRolesDto: CreateBulkUserRolesDto) {
    return this.userRolesService.createBulk(createUserRolesDto);
  }

  @Get()
  findAll(@Req() req: Request, @Query() query: UserRoleQueryDto) {
    return this.userRolesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userRolesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.userRolesService.update(+id, updateUserRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userRolesService.remove(+id);
  }
}
