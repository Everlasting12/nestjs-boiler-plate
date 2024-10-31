import { EmailLocalStrategy } from '../strategies/email.local.strategy';
import { PushLocalStrategy } from '../strategies/push.local.strategy';
import { SmsLocalStrategy } from '../strategies/sms.local.strategy';

const notificationServiceTypes = {
  LOCAL: 'LOCAL',
  TWILIO: 'TWILIO',
};
export const notificationChannelTypes = {
  SMS: 'SMS',
  PUSH: 'PUSH',
  EMAIL: 'EMAIL',
};

export class NotificationFactory {
  static getStrategy(
    serviceType: keyof typeof notificationServiceTypes,
    channelType: keyof typeof notificationChannelTypes,
  ) {
    switch (true) {
      case channelType === notificationChannelTypes.SMS &&
        serviceType === notificationServiceTypes.LOCAL:
        return new SmsLocalStrategy();
      case channelType === notificationChannelTypes.EMAIL &&
        serviceType === notificationServiceTypes.LOCAL:
        return new EmailLocalStrategy();
      case channelType === notificationChannelTypes.PUSH &&
        serviceType === notificationServiceTypes.LOCAL:
        return new PushLocalStrategy();
      default:
        throw new Error('Unknown channel type');
    }
  }
}
