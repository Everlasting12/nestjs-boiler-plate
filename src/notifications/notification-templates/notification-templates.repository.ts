import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationTemplatesRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    createNotificationTemplateDto: Prisma.NotificationTemplateCreateInput,
  ) {
    return await this.prisma.notificationTemplate.create({
      data: createNotificationTemplateDto,
    });
  }

  async findAll() {
    return `This action returns all notificationTemplates`;
  }

  async findOne(query: Prisma.NotificationTemplateWhereUniqueInput) {
    return await this.prisma.notificationTemplate.findUnique({
      where: query,
    });
  }

  async update(
    query: Prisma.NotificationTemplateWhereUniqueInput,
    updateNotificationTemplateDto: Prisma.NotificationTemplateUpdateInput,
  ) {
    return await this.prisma.notificationTemplate.update({
      where: query,
      data: updateNotificationTemplateDto,
    });
  }

  async remove(id: number) {
    return `This action removes a #${id} notificationTemplate`;
  }
}
