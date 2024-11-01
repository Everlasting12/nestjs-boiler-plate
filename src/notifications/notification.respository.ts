import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NotificationRepository {
  constructor(private prisma: PrismaService) {}

  async create(body: Prisma.NotificationCreateInput) {
    return await this.prisma.notification.create({
      data: body,
    });
  }
  async bulkCreate(body: Prisma.NotificationCreateInput[]) {
    return await this.prisma.notification.createMany({
      data: body,
    });
  }
}
