import { Injectable } from '@nestjs/common';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { RoleQueryDto } from './dto/get-role-query.dto';

@Injectable()
export class RolesRepository {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: Prisma.RoleCreateInput) {
    return await this.prisma.role.create({
      data: createRoleDto,
    });
  }

  async createBulk(createRolesDto: Prisma.RoleCreateInput[]) {
    return await this.prisma.role.createMany({
      data: createRolesDto,
    });
  }

  async findAll(query: RoleQueryDto) {
    const { paginate, skip, limit, ...restQuery } = query;

    restQuery.roleId = { in: restQuery.roleId } as any;

    if (!paginate) {
      const data = await this.prisma.role.findMany({
        where: restQuery as Prisma.RoleWhereInput,
        orderBy: {
          updatedAt: 'desc',
        },
      });
      return {
        data,
        total: data.length,
      };
    }

    const [total, data] = await Promise.all([
      this.prisma.role.count({
        where: restQuery as Prisma.RoleWhereInput,
      }),
      this.prisma.role.findMany({
        where: restQuery as Prisma.RoleWhereInput,
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: limit,
      }),
    ]);

    return {
      total,
      skip,
      limit,
      data,
    };
  }

  async findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    console.log(
      '🚀 ~ RolesRepository ~ update ~ updateRoleDto:',
      updateRoleDto,
    );
    return `This action updates a #${id} role`;
  }

  async remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
