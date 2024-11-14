import { Injectable } from '@nestjs/common';
import {
  CreateBulkPermissionsDto,
  CreatePermissionDto,
} from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsRepository } from './permissions.repository';
import { PermissionQueryDto } from './dto/get-permission-query.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionRepository: PermissionsRepository) {}

  async create(createPermissionDto: CreatePermissionDto) {
    return await this.permissionRepository.create(createPermissionDto);
  }
  async createBulk(createPermissionsDto: CreateBulkPermissionsDto) {
    return await this.permissionRepository.createBulk(
      createPermissionsDto.data,
    );
  }

  async findAll(query: PermissionQueryDto) {
    return await this.permissionRepository.findAll(query);
  }

  async findOne(id: number) {
    return await this.permissionRepository.findOne(id);
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return await this.permissionRepository.update(id, updatePermissionDto);
  }

  async remove(id: number) {
    return await this.permissionRepository.remove(id);
  }
}
