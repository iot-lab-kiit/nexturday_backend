import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { S3BucketProvider } from './s3-bucket.provider';
import crypto from 'crypto';
import 'dotenv/config';
import { IFile, IImageData } from '../../interfaces';
import { CustomError } from '../../utils';
import { CHUNK_SIZE } from '../../common/constants';
import { Readable } from 'stream';

export class S3BucketService {
  private s3BucketProvider: S3BucketProvider;
  private bucketName: string;

  constructor() {
    this.s3BucketProvider = new S3BucketProvider();
    this.bucketName = process.env.BUCKET_NAME as string;
  }

  async uploadSingle(file: IFile): Promise<IImageData> {
    const imageKey = await this.uploadChunk(file);

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

  private async uploadChunk(file: IFile): Promise<string> {
    const imageKey = crypto.randomBytes(32).toString('hex');
    const parts: Array<{ PartNumber: number; ETag: string }> = [];

    const createUploadResponse = await this.s3BucketProvider.s3.send(
      new CreateMultipartUploadCommand({
        Bucket: this.bucketName,
        Key: imageKey,
      }),
    );
    const uploadId = createUploadResponse.UploadId;
    if (!uploadId) {
      throw new CustomError('upload failed', 500);
    }

    const totalChunks = Math.ceil(file.buffer.length / CHUNK_SIZE);

    for (let i = 1; i <= totalChunks; i++) {
      const start = (i - 1) * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.buffer.length);
      const chunk = file.buffer.subarray(start, end);

      const uploadPartResponse = await this.s3BucketProvider.s3.send(
        new UploadPartCommand({
          Bucket: this.bucketName,
          Key: imageKey,
          UploadId: uploadId,
          PartNumber: i,
          Body: chunk,
        }),
      );

      parts.push({ PartNumber: i, ETag: uploadPartResponse.ETag! });
    }

    await this.s3BucketProvider.s3.send(
      new CompleteMultipartUploadCommand({
        Bucket: this.bucketName,
        Key: imageKey,
        UploadId: uploadId,
        MultipartUpload: { Parts: parts },
      }),
    );

    return imageKey;
  }
}
