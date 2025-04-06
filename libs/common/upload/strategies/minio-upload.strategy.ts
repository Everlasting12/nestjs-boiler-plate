import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadStrategy } from '../interfaces/upload.strategy';
import * as Minio from 'minio';
import { Readable } from 'stream';
import { UploadProvider } from '../interfaces/upload-provider.enum';

@Injectable()
export class MinIOUploadStrategy implements UploadStrategy {
  private static minioClient: Minio.Client | null = null;

  constructor() {
    this.initializeMinioClient();
  }

  private async initializeMinioClient() {
    if (process.env.FILE_UPLOAD_STRATEGY !== UploadProvider.MINIO) {
      return;
    }

    const requiredEnvVars = [
      'MINIO_ENDPOINT',
      'MINIO_PORT',
      'MINIO_ROOT_USER',
      'MINIO_ROOT_PASSWORD',
      'MINIO_ACCESS_KEY',
      'MINIO_SECRET_KEY',
      'MINIO_URL_EXPIRY_IN_SECONDS',
      'MINIO_USE_SSL',
      'DEFAULT_MINIO_BUCKET',
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    }

    if (!MinIOUploadStrategy.minioClient) {
      MinIOUploadStrategy.minioClient = new Minio.Client({
        endPoint: process.env.MINIO_ENDPOINT!,
        port: parseInt(process.env.MINIO_PORT!, 10),
        useSSL: process.env.MINIO_USE_SSL === 'true',
        accessKey: process.env.MINIO_ACCESS_KEY!,
        secretKey: process.env.MINIO_SECRET_KEY!,
      });

      await this.ensureBucketExists(process.env.DEFAULT_MINIO_BUCKET!);
    }
  }

  async upload(
    stream: Readable,
    filename: string,
    bucketName: string,
  ): Promise<string> {
    const client = MinIOUploadStrategy.minioClient!;
    if (client) {
      if (bucketName) await this.ensureBucketExists(bucketName);
      await client.putObject(
        bucketName ?? process.env.DEFAULT_MINIO_BUCKET!,
        filename,
        stream,
      );
    }
    return `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName ?? process.env.DEFAULT_MINIO_BUCKET}/${filename}`;
  }

  async getPresignedUrl(filename: string, bucketName: string): Promise<string> {
    const client = MinIOUploadStrategy.minioClient!;
    if (bucketName) await this.ensureBucketExists(bucketName);
    return client.presignedPutObject(
      bucketName ?? process.env.DEFAULT_MINIO_BUCKET!,
      filename,
      parseInt(process.env.MINIO_URL_EXPIRY_IN_SECONDS || '300', 10),
    );
  }

  async getMultiPresignedUrl(
    filenames: string[],
    bucketName: string,
  ): Promise<{ [filename: string]: string }> {
    const client = MinIOUploadStrategy.minioClient!;
    if (bucketName) await this.ensureBucketExists(bucketName);
    const expiry = parseInt(
      process.env.MINIO_URL_EXPIRY_IN_SECONDS || '300',
      10,
    );

    const presignedUrls: { [filename: string]: string } = {};

    for (const filename of filenames) {
      const url = await client.presignedPutObject(
        bucketName ?? process.env.DEFAULT_MINIO_BUCKET!,
        filename,
        expiry,
      );

      presignedUrls[filename] = url;
    }

    return presignedUrls;
  }

  private async ensureBucketExists(bucketName: string): Promise<void> {
    try {
      const client = MinIOUploadStrategy.minioClient!;
      let exists = false;
      try {
        await client.getBucketPolicy(bucketName);
        exists = true; // If we get the policy, it means the bucket exists
      } catch (err) {
        if (err.code === 'NoSuchBucket') {
          exists = false;
        } else {
          throw err; // Unexpected error
        }
      }

      // Create the bucket if it doesn't exist
      if (!exists) {
        try {
          await client.makeBucket(bucketName);
        } catch (err) {
          if (err.code === 'BucketAlreadyOwnedByYou') {
            throw err;
          } else {
            // Handle other errors (e.g., permissions)
            throw err;
          }
        }
      }

      // Define a public policy for the bucket
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'PublicRead',
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: `arn:aws:s3:::${bucketName}/*`,
          },
        ],
      };
      await client.setBucketPolicy(bucketName, JSON.stringify(policy));
    } catch (error) {
      throw new BadRequestException(
        `Error checking or creating bucket: ${error.message}`,
      );
    }
  }
}
