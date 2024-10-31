import { Injectable } from '@nestjs/common';
import { CreateNotificationTemplateDto } from './dto/create-notification-template.dto';
import { UpdateNotificationTemplateDto } from './dto/update-notification-template.dto';
import { NotificationTemplatesRepository } from './notification-templates.repository';
import { LoggerService } from 'libs/common/logger/logger.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationTemplatesService {
  constructor(
    private readonly notificationTemplatesRepository: NotificationTemplatesRepository,
  ) {}

  logger: LoggerService = new LoggerService();

  async create(createNotificationTemplateDto: CreateNotificationTemplateDto) {
    this.logger.debug(
      'NotificationTemplatesService ~ create ~ createNotificationTemplateDto:',
      createNotificationTemplateDto,
    );
    return await this.notificationTemplatesRepository.create(
      createNotificationTemplateDto as unknown as Prisma.NotificationTemplateCreateInput,
    );
  }

  async findAll() {
    return `This action returns all notificationTemplates`;
  }

  async findOne(query: Prisma.NotificationTemplateWhereUniqueInput) {
    return await this.notificationTemplatesRepository.findOne(query);
  }

  async update(
    templateId: string,
    updateNotificationTemplateDto: UpdateNotificationTemplateDto,
  ) {
    this.logger.debug(
      `NotificationTemplatesService ~ update ~ templateId: ${templateId} ~ updateNotificationTemplateDto:`,
      updateNotificationTemplateDto,
    );
    return await this.notificationTemplatesRepository.update(
      { templateId },
      updateNotificationTemplateDto as unknown as Prisma.NotificationTemplateUpdateInput,
    );
  }

  async remove(templateId: string) {
    return `This action removes a #${templateId} notificationTemplate`;
  }
}
