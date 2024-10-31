import { NotificationStrategy } from './notification-strategy.js';
import { notificationChannelTypes } from '../factory/notification.factory.js';
import admin from 'firebase-admin';
import { Utility } from '../../../libs/common/utils.js';
import { LoggerService } from '../../../libs/common/logger/logger.service.js';
import { PUSH } from '../dto/create-notification.dto.js';
import { NotificationTemplate } from '../types/notification-template.type.js';

const logger: LoggerService = new LoggerService();
export class PushLocalStrategy extends NotificationStrategy {
  async sendNotification(template: NotificationTemplate, data: PUSH[]) {
    logger.debug('inside', PushLocalStrategy.name);
    if (!template.channelType[notificationChannelTypes.PUSH]) {
      logger.error(
        `this channelType:${notificationChannelTypes.PUSH} does not supported by the provided template`,
      );
      return;
    }

    const {
      content: { title, subTitle },
      variables: templateVariables,
    } = template.channels.PUSH;

    const promises = data.map((push) =>
      this.sendFcmNotification(
        push.recipient,
        push.variables,
        templateVariables,
        title,
        subTitle,
      ),
    );
    const results = await Promise.allSettled(promises);

    results.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        logger.debug(`results.forEach ${JSON.stringify(result, null, 4)}`);
        logger.debug(
          `results.forEach FCM Push to ${data[idx].recipient} was sent successfully.`,
        );
      } else {
        logger.debug(
          `results.forEach error ${JSON.stringify(result, null, 4)}`,
        );
        logger.error(
          `results.forEach FCM Push to ${data[idx].recipient} failed:`,
          result.reason,
        );
      }
    });
  }

  sendFcmNotification(
    recipient: string[],
    variables: { [key: string]: string },
    templateVariables: string[],
    title: string,
    subTitle: string,
  ) {
    logger.debug(
      `sendFcmNotification recipient ${recipient} variables ${JSON.stringify(variables)}`,
    );
    const missingVariables = Utility.findMissingKeys(
      templateVariables,
      variables,
    );
    if (!missingVariables?.length) {
      const notification = {};
      if (title) {
        notification['title'] = Utility.fillTemplate(title, variables);
      }
      if (subTitle) {
        notification['body'] = Utility.fillTemplate(subTitle, variables);
      }
      if (variables?.imgUrl) {
        notification['imgUrl'] = variables?.imgUrl;
      }
      const actions = variables?.actions ?? [];
      delete variables?.actions;
      notification['data'] = variables ?? {};
      logger.debug(
        `sendFcmNotification ~ notification: ${JSON.stringify(notification, null, 4)}`,
      );

      return admin.messaging().sendEachForMulticast({
        tokens: recipient,
        data: {
          priority: 'high',
          notifee: JSON.stringify({
            ...notification,
            android: {
              channelId: 'default',
              smallIcon: 'ic_notification',
              color: '#000000',
              actions,
            },
          }),
        },
      });
    } else {
      logger.debug(
        `missing variables found ${missingVariables} for recipient ${recipient}`,
      );
    }
  }
}
