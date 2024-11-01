import { BadRequestException, Injectable } from '@nestjs/common';
import { SendNotificationDto } from './dto/send-notification.dto';
import { NotificationTemplatesService } from './notification-templates/notification-templates.service';
import { LoggerService } from 'libs/common/logger/logger.service';
import {
  notificationChannelTypes,
  NotificationFactory,
} from './factory/notification.factory';
import { NotificationTemplate } from './types/notification-template.type';
import { NotificationRepository } from './notification.respository';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationTemplateService: NotificationTemplatesService,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  logger: LoggerService = new LoggerService();
  async create(SendNotificationDto: SendNotificationDto) {
    this.logger.debug(
      'NotificationsService ~ create ~ SendNotificationDto:',
      SendNotificationDto,
    );

    const { payload, templateName } = SendNotificationDto;

    const template = await this.notificationTemplateService.findOne({
      name: templateName,
    });
    this.logger.debug('NotificationsService ~ create ~ template:', template);

    if (!template) {
      throw new BadRequestException('invalid notification template');
    }

    const { channelType } = template;

    const notificationBulk: CreateNotificationDto[] = [];

    for (const [key] of Object.entries(payload)) {
      if (!channelType[key]) {
        this.logger.info(
          `NotificationsService ~ create ~ key:${key} is not configured in the notification template:${templateName}`,
        );
      } else {
        this.logger.debug(
          `NotificationsService ~ create ~ serviceType:${channelType[key]}, channelType:${JSON.stringify(channelType)} key:${key}`,
        );
        const strategy = NotificationFactory.getStrategy(
          channelType[key],
          key as keyof typeof notificationChannelTypes,
        );

        await strategy.sendNotification(
          template as NotificationTemplate,
          payload[key],
          notificationBulk,
        );

        this.logger.debug(
          'NotificationsService ~ create ~ notificationBulk:',
          notificationBulk,
        );
        if (notificationBulk?.length)
          this.notificationRepository.bulkCreate(notificationBulk);
      }
    }

    return {
      message: 'Notification request send succesfully',
    };
  }
}
