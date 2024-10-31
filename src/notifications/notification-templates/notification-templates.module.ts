import { Module } from '@nestjs/common';
import { NotificationTemplatesService } from './notification-templates.service';
import { NotificationTemplatesController } from './notification-templates.controller';
import { NotificationTemplatesRepository } from './notification-templates.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [NotificationTemplatesController],
  providers: [
    PrismaService,
    NotificationTemplatesService,
    NotificationTemplatesRepository,
  ],
  exports: [
    PrismaService,
    NotificationTemplatesService,
    NotificationTemplatesRepository,
  ],
})
export class NotificationTemplatesModule {}
