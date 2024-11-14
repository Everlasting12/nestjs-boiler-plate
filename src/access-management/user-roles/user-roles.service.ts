import { ConflictException, Injectable } from '@nestjs/common';
import {
  CreateBulkUserRolesDto,
  CreateUserRoleDto,
} from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRolesRepository } from './user-roles.repository';
import { UserRoleQueryDto } from './dto/get-user-role-query.dto';

@Injectable()
export class UserRolesService {
  constructor(private readonly userRolesRepository: UserRolesRepository) {}

  async create(createUserRoleDto: CreateUserRoleDto) {
    await this.checkIfUserWithRoleAlreadyExists(createUserRoleDto, true);
    return await this.userRolesRepository.create(createUserRoleDto);
  }

  async createBulk(createUserRolesDto: CreateBulkUserRolesDto) {
    return await this.userRolesRepository.createBulk(createUserRolesDto);
  }

  async findAll(query: UserRoleQueryDto) {
    return await this.userRolesRepository.findAll(query);
  }

  findOne(id: number) {
    return `This action returns a #${id} userRole`;
  }

  async update(id: number, updateUserRoleDto: UpdateUserRoleDto) {
    return await this.userRolesRepository.update(id, updateUserRoleDto);
  }

  remove(id: number) {
    return `This action removes a #${id} userRole`;
  }

  async checkIfUserWithRoleAlreadyExists(
    createUserRoleDto: CreateUserRoleDto,
    shouldThrowAlreadyExistError: boolean = false,
  ) {
    const exists = await this.findAll({
      isActive: true,
      paginate: false,
      roleId: [createUserRoleDto.roleId],
      userId: [createUserRoleDto.userId],
    });

    if (!!exists.total && shouldThrowAlreadyExistError) {
      throw new ConflictException(
        'Resource already available with provided data',
      );
    }
    return !!exists.total;
  }
}
