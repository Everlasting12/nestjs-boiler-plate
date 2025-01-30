import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserQueryDto } from './dto/get-user-query.dto';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(query: UserQueryDto) {
    const { paginate, relation, skip, limit, select, userIds, ...restQuery } =
      query;

    if (restQuery.name) {
      restQuery.name = {
        contains: restQuery.name,
        mode: 'insensitive',
      } as any;
    }
    if (restQuery.email) {
      restQuery.email = {
        contains: restQuery.email,
      } as any;
    }
    if (userIds?.length) {
      restQuery['userId'] = {
        in: userIds,
      };
    }

    const includeRelations = relation
      ? {
          userRole: {
            select: { roleId: true, role: { select: { name: true } } },
          },
        }
      : undefined;

    if (!paginate) {
      const data = await this.prisma.user.findMany({
        relationLoadStrategy: 'join',
        where: restQuery as Prisma.UserWhereInput,
        orderBy: {
          updatedAt: 'desc',
        },
        ...(select?.length
          ? { select: Object.fromEntries(select.map((field) => [field, true])) }
          : {}),
        include: includeRelations,
      });
      return {
        data,
        total: data.length,
      };
    }

    const [total, data] = await Promise.all([
      this.prisma.user.count({
        where: restQuery as Prisma.UserWhereInput,
      }),
      this.prisma.user.findMany({
        relationLoadStrategy: 'join',
        where: restQuery as Prisma.UserWhereInput,
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: limit,
        ...(select?.length
          ? { select: Object.fromEntries(select.map((field) => [field, true])) }
          : {}),
        include: includeRelations,
      }),
    ]);

    return {
      total,
      skip,
      limit,
      data,
    };
  }
  async findOne(query: UserQueryDto) {
    const { relation, select, userIds, ...restQuery } = query;

    if (userIds?.length) {
      restQuery['userId'] = {
        in: userIds,
      };
    }
    const includeRelations = relation
      ? {
          userRole: true,
        }
      : undefined;

    return this.prisma.user.findFirst({
      ...(select?.length
        ? { select: Object.fromEntries(select.map((field) => [field, true])) }
        : {}),
      where: restQuery as Prisma.UserWhereInput,
      include: includeRelations,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async getTotalUserCount() {
    return await this.prisma.user.count();
  }

  async updatePassword(userId: string, hashedNewPassword: string) {
    return await this.prisma.user.update({
      where: { userId },
      data: { password: hashedNewPassword },
    });
  }

  async updateOne(
    query: Prisma.UserWhereUniqueInput,
    body: Prisma.UserUpdateInput,
  ) {
    return await this.prisma.user.update({
      where: query,
      data: body,
    });
  }
}
