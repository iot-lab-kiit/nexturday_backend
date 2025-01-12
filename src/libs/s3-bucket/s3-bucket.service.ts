import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { S3BucketProvider } from './s3-bucket.provider';
import crypto from 'crypto';
import 'dotenv/config';
import { IFile, IImageData } from '../../interfaces';

export class S3BucketService {
  private s3BucketProvider: S3BucketProvider;
  private bucketName: string;

  constructor() {
    this.s3BucketProvider = new S3BucketProvider();
    this.bucketName = process.env.BUCKET_NAME as string;
  }

  async uploadSingle(file: IFile): Promise<IImageData> {
    const imageKey = crypto.randomBytes(32).toString('hex');
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: imageKey,
      Body: file.buffer,
      ContentType: file.contentType,
    });
    await this.s3BucketProvider.s3.send(command);

    return {
      url: `https://${this.bucketName}.s3.amazonaws.com/${imageKey}`,
      key: imageKey,
    };
  }

  async uploadMultiple(files: IFile[]): Promise<IImageData[]> {
    return await Promise.all(files.map((file) => this.uploadSingle(file)));
  }

  async deleteSingle(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3BucketProvider.s3.send(command);
  }

  async deleteMultiple(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.deleteSingle(key)));
  }
}
