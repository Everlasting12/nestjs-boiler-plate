import 'dotenv/config';
import { NotificationStrategy } from './notification-strategy';
import { notificationChannelTypes } from '../factory/notification.factory';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';
import * as nodemailer from 'nodemailer';
import { Utility } from '../../../libs/common/utils';
import { LoggerService } from '../../../libs/common/logger/logger.service';
import { TransportOptions } from 'nodemailer';
import { NotificationTemplate } from '../types/notification-template.type';
import { EMAIL } from '../dto/send-notification.dto';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import {
  Attendee,
  CalenderEventBuilder,
  Question,
} from '../builder/calendar-event.builder';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE_HOST,
  port: process.env.EMAIL_SERVICE_PORT ?? 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL_API_KEY,
    pass: process.env.EMAIL_SECRETE_KEY,
  },
} as TransportOptions);

export class EmailLocalStrategy implements NotificationStrategy {
  logger: LoggerService = new LoggerService();

  async sendNotification(
    template: NotificationTemplate,
    data: EMAIL[],
    notificationBulk: CreateNotificationDto[],
  ) {
    this.logger.debug(`inside ${EmailLocalStrategy.name}`);
    if (!template.channelType[notificationChannelTypes.EMAIL]) {
      this.logger.error(
        `EmailLocalStrategy ~ sendNotification ~ this channelType:${notificationChannelTypes.EMAIL} does not supported by the provided template`,
      );
      return;
    }
    const { content, variables: templateVariables } = template.channels.EMAIL;

    const templatePath = path.join('email-templates', content.templateName);
    this.logger.debug(
      'EmailLocalStrategy ~ sendNotification ~ templatePath',
      templatePath,
    );
    const ejsTemplate = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = ejs.compile(ejsTemplate);

    const sendEmail = (
      recipient: string,
      variables: { [key: string]: any } = {},
    ) => {
      this.logger.debug(
        `EmailLocalStrategy ~ sendNotification ~ sendEmail recipient ${recipient} variables ${JSON.stringify(variables)}`,
      );

      const missingVariables = Utility.findMissingKeys(
        templateVariables,
        variables,
      );
      if (!missingVariables?.length) {
        const emailObject = {
          from: `${process.env.APP_NAME} <${process.env.APP_EMAIL_ID}>`, // sender address
          to: recipient, // list of receivers
          subject: Utility.fillTemplate(content.subject, variables), // Subject line
          html: compiledTemplate(variables), // html body
          attachments: [],
        };

        if (variables['isCalendarEvent']) {
          const {
            startDate,
            endDate,
            allDay,
            summary,
            description,
            location,
            organiser,
            attendees,
            questions,
            url,
          } = variables;
          const eventObj = new CalenderEventBuilder(
            new Date(startDate),
            new Date(endDate),
            summary,
            allDay,
          )
            .setDescription(description)
            .setLocation(`${location}, ${url}`)
            .setOrganizer(organiser);

          if (url) eventObj.setUrl(url);

          if (attendees?.length) {
            const attendeesEmails = attendees?.map((attendee: Attendee) => {
              eventObj.addAttendee(attendee?.name, attendee?.email);
              return attendee?.email;
            });
            emailObject.to = `${recipient},${attendeesEmails?.join(',')}`;
          }
          if (questions?.length) {
            questions?.forEach(({ answers, question }: Question) => {
              eventObj.addQuestion(question, answers);
            });
          }
          const calendarEvent = eventObj.build();
          this.logger.debug(
            'EmailLocalStrategy ~ sendNotification ~ calendarEvent:',
            calendarEvent,
          );

          emailObject.attachments.push({
            filename: 'invitation.ics',
            content: calendarEvent.toString(),
            contentType: 'text/calendar; charset=utf-8',
          });
        }
        this.logger.debug(
          '🚀EMAIL ~ EmailLocalStrategy ~ emailObject:',
          emailObject,
        );

        return transporter.sendMail(emailObject);
      } else {
        this.logger.debug(
          `EmailLocalStrategy ~ sendNotification ~ sendEmail missing variables found ${JSON.stringify(missingVariables)} for recipient ${recipient}`,
        );
      }
    };

    const promises = data.map((email: EMAIL) =>
      sendEmail(email.recipient, email.variables),
    );

    const results = await Promise.allSettled(promises);

    results.forEach((result, idx) => {
      let success = false;
      let message = '';
      if (result.status === 'fulfilled') {
        this.logger.debug(
          `EmailLocalStrategy ~ sendNotification result ${JSON.stringify(result)}`,
        );
        this.logger.debug(
          `EmailLocalStrategy ~ sendNotification Email to ${data[idx].recipient} was sent successfully.`,
        );
        success = true;
        message = `Email to ${data[idx].recipient} was sent successfully.`;
      } else {
        this.logger.error(
          `EmailLocalStrategy ~ sendNotification Email to ${data[idx].recipient} failed:`,
          result.reason,
        );
        success = false;
        message = JSON.stringify(result.reason);
      }

      const dto = new CreateNotificationDto();
      dto.templateName = template.name;
      dto.recipient = data[idx].recipient;
      dto.success = success;
      dto.message = message;
      dto.body = data[idx];

      notificationBulk.push(dto);
    });
  }
}
