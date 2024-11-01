import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationTemplatesModule } from './notification-templates/notification-templates.module';
import { PrismaService } from 'src/prisma.service';
import { NotificationRepository } from './notification.respository';

@Module({
  imports: [NotificationTemplatesModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService, NotificationRepository],
})
export class NotificationsModule {}
