import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotificationTemplatesService } from './notification-templates.service';
import { CreateNotificationTemplateDto } from './dto/create-notification-template.dto';
import { UpdateNotificationTemplateDto } from './dto/update-notification-template.dto';

@Controller({ path: 'notification-templates', version: '1' })
export class NotificationTemplatesController {
  constructor(
    private readonly notificationTemplatesService: NotificationTemplatesService,
  ) {}

  @Post()
  async create(
    @Body() createNotificationTemplateDto: CreateNotificationTemplateDto,
  ) {
    return this.notificationTemplatesService.create(
      createNotificationTemplateDto,
    );
  }

  @Get()
  async findAll() {
    return this.notificationTemplatesService.findAll();
  }

  @Get(':templateId')
  async findOne(@Param('templateId') templateId: string) {
    return this.notificationTemplatesService.findOne({ templateId });
  }

  @Patch(':templateId')
  async update(
    @Param('templateId') templateId: string,
    @Body() updateNotificationTemplateDto: UpdateNotificationTemplateDto,
  ) {
    return this.notificationTemplatesService.update(
      templateId,
      updateNotificationTemplateDto,
    );
  }

  @Delete(':templateId')
  async remove(@Param('templateId') templateId: string) {
    return this.notificationTemplatesService.remove(templateId);
  }
}
