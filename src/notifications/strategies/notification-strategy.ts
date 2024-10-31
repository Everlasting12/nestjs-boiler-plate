import { LoggerService } from '../../../libs/common/logger/logger.service';
import { EMAIL, PUSH, SMS } from '../dto/create-notification.dto';
import { NotificationTemplate } from '../types/notification-template.type';

// notificationStrategy.js
export class NotificationStrategy {
  logger: LoggerService = new LoggerService();
  async sendNotification(
    template: NotificationTemplate,
    data: SMS[] | PUSH[] | EMAIL[],
  ) {
    this.logger.debug(
      'NotificationStrategy ~ sendNotification ~ template',
      template,
      data,
    );
    throw new Error('sendNotification method must be implemented');
  }
}
