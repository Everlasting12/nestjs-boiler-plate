import { Readable } from 'stream';

export interface UploadStrategy {
  upload(
    stream: Readable,
    filename: string,
    bucketName: string,
    metadata?: Record<string, any>,
  ): Promise<string>;

  getPresignedUrl?(
    filename: string,
    bucketName: string,
    metadata?: Record<string, any>,
  ): Promise<string>;

  getMultiPresignedUrl?(
    filenames: string[],
    bucketName: string,
    metadata?: Record<string, any>,
  ): Promise<{ [filename: string]: string }>;
}
