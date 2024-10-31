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
import { EMAIL } from '../dto/create-notification.dto';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE_HOST,
  port: process.env.EMAIL_SERVICE_PORT ?? 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL_API_KEY,
    pass: process.env.EMAIL_SECRETE_KEY,
  },
} as TransportOptions);

export class EmailLocalStrategy extends NotificationStrategy {
  logger: LoggerService = new LoggerService();

  async sendNotification(template: NotificationTemplate, data: EMAIL[]) {
    this.logger.debug(`inside ${EmailLocalStrategy.name}`);
    if (!template.channelType[notificationChannelTypes.EMAIL]) {
      this.logger.error(
        `EmailLocalStrategy ~ sendNotification ~ this channelType:${notificationChannelTypes.EMAIL} does not supported by the provided template`,
      );
      return;
    }
    const { content, variables: templateVariables } = template.channels.EMAIL;

    const templatepath = path.join('email-templates', content.templateName);
    this.logger.debug(
      'EmailLocalStrategy ~ sendNotification ~ templatepath',
      templatepath,
    );
    const ejsTemplate = fs.readFileSync(templatepath, 'utf-8');
    const compiledTemplate = ejs.compile(ejsTemplate);

    const sendEmail = (
      recipient: string,
      variables: { [key: string]: string } = {},
    ) => {
      this.logger.debug(
        `EmailLocalStrategy ~ sendNotification ~ sendEmail recipient ${recipient} variables ${JSON.stringify(variables)}`,
      );

      const missingVariables = Utility.findMissingKeys(
        templateVariables,
        variables,
      );
      if (!missingVariables?.length)
        return transporter.sendMail({
          from: `${process.env.APP_NAME} <${process.env.APP_EMAIL_ID}>`, // sender address
          to: recipient, // list of receivers
          subject: Utility.fillTemplate(content.subject, variables), // Subject line
          html: compiledTemplate(variables), // html body
        });
      else {
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
      if (result.status === 'fulfilled') {
        this.logger.debug(
          `EmailLocalStrategy ~ sendNotification result ${JSON.stringify(result)}`,
        );
        this.logger.debug(
          `EmailLocalStrategy ~ sendNotification Email to ${data[idx].recipient} was sent successfully.`,
        );
      } else {
        this.logger.error(
          `EmailLocalStrategy ~ sendNotification Email to ${data[idx].recipient} failed:`,
          result.reason,
        );
      }
    });
  }
}
