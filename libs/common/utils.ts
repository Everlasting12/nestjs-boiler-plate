import { LoggerService } from './logger/logger.service';

const logger: LoggerService = new LoggerService();

export class Utility {
  static fillTemplate(string: string, data: { [key: string]: string }) {
    return string.replace(/{{(.*?)}}/g, (match, p1) => data[p1.trim()] || '');
  }

  static findMissingKeys(obj1: string[], obj2: Record<string, any>) {
    // Initialize an empty array to store missing keys
    const missingKeys: string[] = [];

    // Loop through each key in obj1
    if (obj1)
      for (const key of obj1) {
        // Check if the key is not present in obj2
        if (!(key in obj2)) {
          // Add the missing key to the array
          missingKeys.push(key);
        }
      }

    // Return the array of missing keys
    logger.debug('Utility ~ static findMissingKeys ~ missingKeys', missingKeys);
    return missingKeys;
  }
}
