import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationTemplatesModule } from './notification-templates/notification-templates.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [NotificationTemplatesModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService],
})
export class NotificationsModule {}
