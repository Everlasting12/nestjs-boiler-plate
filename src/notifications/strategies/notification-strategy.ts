// import { LoggerService } from '../../../libs/common/logger/logger.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { EMAIL, PUSH, SMS } from '../dto/send-notification.dto';
import { NotificationTemplate } from '../types/notification-template.type';

// notificationStrategy.js
export interface NotificationStrategy {
  sendNotification(
    template: NotificationTemplate,
    data: SMS[] | PUSH[] | EMAIL[],
    notificationBulk: CreateNotificationDto[],
  ): Promise<void>;
}
