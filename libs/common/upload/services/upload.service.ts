import { Injectable, Logger } from '@nestjs/common';
import { Readable } from 'stream';
import { retryWithBackoff } from '../utils/retry.util';
import { UploadProvider } from '../interfaces/upload-provider.enum';
import { UploadStrategyFactory } from './upload-strategy.factory';
import { ConfigurationsService } from 'src/configurations/configurations.service';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  constructor(
    private readonly factory: UploadStrategyFactory,
    private readonly configurationService: ConfigurationsService,
  ) {}

  async uploadFile(
    stream: Readable,
    filename: string,
    bucketKey: string,
    metadata?: Record<string, any>,
  ): Promise<string> {
    const strategy = this.factory.getStrategy(
      process.env.FILE_UPLOAD_STRATEGY! as UploadProvider,
    );

    let bucketName: string | undefined;
    if (bucketKey)
      bucketName = (await this.configurationService.findOne(bucketKey ?? ''))
        ?.value as string;

    return retryWithBackoff(
      async () => {
        this.logger.log(`Attempting upload: ${filename}`);
        return await strategy.upload(stream, filename, bucketName, metadata);
      },
      3,
      1000,
    );
  }

  async getPresignedUrl(body: { filename: string }, bucketKey: string) {
    const strategy = this.factory.getStrategy(
      process.env.FILE_UPLOAD_STRATEGY! as UploadProvider,
    );

    let bucketName: string | undefined;
    if (bucketKey)
      bucketName = (
        await this.configurationService.findOne(bucketKey ?? '')
      )?.value?.toString();

    return retryWithBackoff(
      async () => {
        this.logger.log(`Attempting upload: ${body.filename}`);
        if (strategy.getPresignedUrl) {
          return await strategy.getPresignedUrl(body.filename, bucketName);
        }
      },
      3,
      1000,
    );
  }
  async getMultiPresignedUrl(body: { filenames: string[] }, bucketKey: string) {
    const strategy = this.factory.getStrategy(
      process.env.FILE_UPLOAD_STRATEGY! as UploadProvider,
    );

    let bucketName: string | undefined;
    if (bucketKey)
      bucketName = (
        await this.configurationService.findOne(bucketKey ?? '')
      )?.value?.toString();

    return retryWithBackoff(
      async () => {
        this.logger.log(`Attempting upload: ${body.filenames.join(',')}`);
        if (strategy.getMultiPresignedUrl) {
          return await strategy.getMultiPresignedUrl(
            body.filenames,
            bucketName,
          );
        }
      },
      3,
      1000,
    );
  }
}
