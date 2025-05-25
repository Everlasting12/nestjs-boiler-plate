import { Injectable } from '@nestjs/common';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { UserRoleQueryDto } from './dto/get-user-role-query.dto';
import {
  CreateBulkUserRolesDto,
  CreateUserRoleDto,
} from './dto/create-user-role.dto';

@Injectable()
export class UserRolesRepository {
  constructor(private prisma: PrismaService) {}

  async create(createUserRoleDto: CreateUserRoleDto) {
    // return await this.prisma.userRole.create({
    //   data: {
    //     role: {
    //       connect: { roleId: createUserRoleDto.roleId },
    //     },
    //     user: {
    //       connect: { userId: createUserRoleDto.userId },
    //     },
    //     permissionEntities: createUserRoleDto.permissionEntities,
    //     isActive: createUserRoleDto.isActive ?? true,
    //     isDefault: createUserRoleDto.isDefault ?? true,
    //     createdAt: createUserRoleDto.createdAt,
    //     updatedAt: createUserRoleDto.updatedAt,
    //   },
    // });
    return await this.prisma.userRole.create({
      data: createUserRoleDto,
    });
  }

  async createBulk(createUserRolesDto: CreateBulkUserRolesDto) {
    return await this.prisma.userRole.createMany({
      data: createUserRolesDto.data as any,
    });
  }

  async findAll(query: UserRoleQueryDto) {
    const { paginate, relation, select, skip, limit, ...restQuery } = query;

    if (restQuery.roleId) {
      restQuery.roleId = { in: restQuery.roleId } as any;
    }
    if (restQuery.userId) {
      restQuery.userId = { in: restQuery.userId } as any;
    }

    const includeRelations = relation
      ? {
          role: {
            select: {
              name: true,
              permissionIds: true,
            },
          },
          user: {
            select: {
              email: true,
              name: true,
              userId: true,
            },
          },
        }
      : undefined;

    if (!paginate) {
      const data = await this.prisma.userRole.findMany({
        relationLoadStrategy: 'join',
        where: restQuery as Prisma.UserRoleWhereInput,
        orderBy: {
          updatedAt: 'desc',
        },
        include: includeRelations,
        ...(select?.length
          ? { select: Object.fromEntries(select.map((field) => [field, true])) }
          : {}),
      });
      return {
        total: data.length,
        data,
      };
    }

    const [total, data] = await Promise.all([
      this.prisma.userRole.count({
        where: restQuery as Prisma.UserRoleWhereInput,
      }),
      this.prisma.userRole.findMany({
        relationLoadStrategy: 'join',
        where: restQuery as Prisma.UserRoleWhereInput,
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: limit,
        include: includeRelations,
        ...(select?.length
          ? { select: Object.fromEntries(select.map((field) => [field, true])) }
          : {}),
      }),
    ]);

    return {
      total,
      skip,
      limit,
      data,
    };
  }

  async findOne(query: UserRoleQueryDto) {
    const { paginate = false, relation, select, ...restQuery } = query;

    if (restQuery.roleId) {
      restQuery.roleId = { in: restQuery.roleId } as any;
    }
    if (restQuery.userId) {
      restQuery.userId = { in: restQuery.userId } as any;
    }

    const includeRelations = relation
      ? {
          role: {
            select: {
              name: true,
              permissionIds: true,
            },
          },
          user: {
            select: {
              email: true,
              name: true,
              userId: true,
            },
          },
        }
      : undefined;

    if (!paginate) {
      const data = await this.prisma.userRole.findFirst({
        relationLoadStrategy: 'join',
        where: restQuery as Prisma.UserRoleWhereInput,
        orderBy: {
          updatedAt: 'desc',
        },
        include: includeRelations,
        ...(select?.length
          ? { select: Object.fromEntries(select.map((field) => [field, true])) }
          : {}),
      });
      return {
        total: data.length,
        data,
      };
    }
  }

  async update(id: number, updateUserRoleDto: UpdateUserRoleDto) {
    return await this.prisma.userRole.update({
      where: { id },
      data: updateUserRoleDto,
    });
  }

  async updateByQuery({ userId, roleId }) {
    return await this.prisma.userRole.updateMany({
      where: { userId },
      data: { roleId },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} userRole`;
  }
}
