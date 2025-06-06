import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(query: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findMany({
      where: query,
    });
  }
  async findOne(query: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where: query,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
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
