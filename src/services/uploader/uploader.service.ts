import { IFile, IImageData } from '../../interfaces';
import { S3BucketService } from '../../libs/s3-bucket';

export class UploaderService {
  private s3BucketService: S3BucketService;

  constructor() {
    this.s3BucketService = new S3BucketService();
  }

  async uploadSingle(file: Express.Multer.File): Promise<IImageData> {
    return await this.s3BucketService.uploadSingle({
      buffer: file.buffer,
      contentType: file.mimetype,
    });
  }

  async uploadMultiple(files: Express.Multer.File[]): Promise<IImageData[]> {
    const filesData: IFile[] = files.map((file) => ({
      buffer: file.buffer,
      contentType: file.mimetype,
    }));

    return await this.s3BucketService.uploadMultiple(filesData);
  }

  async deleteSingle(imageData: IImageData): Promise<void> {
    return await this.s3BucketService.deleteSingle(imageData);
  }

  async deleteMultiple(imagesData: IImageData[]): Promise<void> {
    return await this.s3BucketService.deleteMultiple(imagesData);
  }
}
