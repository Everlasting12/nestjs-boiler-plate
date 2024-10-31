import { NotificationStrategy } from './notification-strategy';
import { notificationChannelTypes } from '../factory/notification.factory';
import { LoggerService } from '../../../libs/common/logger/logger.service';
import { SMS } from '../dto/create-notification.dto';
import { NotificationTemplate } from '../types/notification-template.type';

export class SmsLocalStrategy extends NotificationStrategy {
  logger: LoggerService = new LoggerService();
  async sendNotification(template: NotificationTemplate, data: SMS[]) {
    if (!template.channelType[notificationChannelTypes.SMS]) {
      this.logger.error(
        `this channelType:${notificationChannelTypes.SMS} does not supported by the provided template`,
        JSON.stringify(data),
      );
      return;
    }

    // Implement the logic to send SMS using local service
    // console.log(`Sending SMS to ${receiverDetails.phone} with content: ${template.channels.SMS.content}`)
    // Replace variables in template.content with attributes
  }
}
