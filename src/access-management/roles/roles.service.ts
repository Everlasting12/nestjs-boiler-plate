import { Injectable } from '@nestjs/common';
import { CreateBulkRolesDto, CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleQueryDto } from './dto/get-role-query.dto';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RolesRepository) {}

  async create(createRoleDto: CreateRoleDto) {
    return await this.roleRepository.create(createRoleDto);
  }

  async createBulk(createRolesDto: CreateBulkRolesDto) {
    return await this.roleRepository.createBulk(createRolesDto.data);
  }

  async findAll(query: RoleQueryDto) {
    return await this.roleRepository.findAll(query);
  }
  async findOne(roleId: string) {
    return await this.roleRepository.findOne(roleId);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  async remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
