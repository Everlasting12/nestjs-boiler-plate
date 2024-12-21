import { Injectable } from '@nestjs/common';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { PermissionQueryDto } from './dto/get-permission-query.dto';

@Injectable()
export class PermissionsRepository {
  constructor(private prisma: PrismaService) {}

  async create(createPermissionDto: Prisma.PermissionCreateInput) {
    return await this.prisma.permission.create({
      data: createPermissionDto,
    });
  }

  async createBulk(createPermissionsDto: Prisma.PermissionCreateInput[]) {
    return await this.prisma.permission.createMany({
      data: createPermissionsDto,
    });
  }

  async findAll(query: PermissionQueryDto) {
    const { paginate, skip, limit, ...restQuery } = query;

    if (restQuery?.name) restQuery.name = { in: restQuery.name } as any;

    if (!paginate) {
      const data = await this.prisma.permission.findMany({
        where: restQuery as Prisma.PermissionWhereInput,
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
      this.prisma.permission.count({
        where: restQuery as Prisma.PermissionWhereInput,
      }),
      this.prisma.permission.findMany({
        where: restQuery as Prisma.PermissionWhereInput,
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
    return `This action returns a #${id} permission`;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    console.log(
      ' PermissionsRepository ~ update ~ updatePermissionDto:',
      updatePermissionDto,
    );
    return `This action updates a #${id} permission`;
  }

  async remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
